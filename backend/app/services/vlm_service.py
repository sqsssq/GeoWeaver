from __future__ import annotations

import base64
import json
import socket
from typing import Any, Dict, Optional
from urllib import error, request

from app.models.schemas import ShapeType
from app.utils.settings import get_vlm_settings


def _extract_json_block(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def _extract_chinese_text_candidates(text: str) -> list[str]:
    lines = [line.strip() for line in text.replace("\\n", "\n").splitlines()]
    candidates: list[str] = []
    for line in lines:
        if not line:
            continue
        if line.startswith("{") or line.startswith("}") or line.startswith('"'):
            continue
        if any(token in line.lower() for token in ["recognizedtext", "diagramsummary", "candidateshape", "warnings"]):
            continue
        if len(line) >= 8:
            candidates.append(line)
    return candidates


def _fallback_text_from_parsed(parsed: Dict[str, Any]) -> Optional[str]:
    candidate_keys = [
        "recognizedText",
        "problemText",
        "questionText",
        "text",
        "promptText",
        "content",
    ]
    for key in candidate_keys:
        value = parsed.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()

    for key, value in parsed.items():
        if isinstance(value, str) and len(value.strip()) >= 12:
            return value.strip()

    return None


def _fallback_summary_from_parsed(parsed: Dict[str, Any]) -> Optional[str]:
    candidate_keys = [
        "diagramSummary",
        "summary",
        "shapeSummary",
        "geometrySummary",
    ]
    for key in candidate_keys:
        value = parsed.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


def _normalize_shape(value: str) -> ShapeType:
    normalized = (value or "").strip().lower()
    if normalized in {"cuboid", "prism", "pyramid"}:
        return normalized  # type: ignore[return-value]
    return "unknown"


def _normalize_api_url(api_url: str) -> str:
    normalized = api_url.rstrip("/")
    if normalized.endswith("/chat/completions"):
        return normalized
    if normalized.endswith("/compatible-mode/v1"):
        return f"{normalized}/chat/completions"
    return normalized


def _coerce_label_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    result: list[str] = []
    for item in value:
        label = str(item).strip().upper()
        if label and label not in result:
            result.append(label)
    return result


def _build_vlm_payload(model: str, image_base64: str, prompt: str) -> dict[str, Any]:
    return {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Return strict JSON only. "
                    "recognizedText is the top priority and should contain the Chinese problem statement."
                ),
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_base64}"},
                    },
                ],
            },
        ],
        "temperature": 0.1,
    }


def _build_json_repair_payload(model: str, raw_message: str) -> dict[str, Any]:
    repair_prompt = (
        "请把下面这段立体几何题图识别结果修复为严格 JSON。"
        "只输出 JSON，不要 markdown，不要解释。"
        "JSON 键必须包含 recognizedText、diagramSummary、candidateShape、pointLabels、"
        "hiddenEdgeSuggestions、baseFaceLabels、apexLabel、warnings。"
        "candidateShape 必须是 cuboid、prism、pyramid、unknown 之一。"
        "数组字段如果没有内容就填空数组，apexLabel 没有就填空字符串。"
        f"\n\n原始内容：\n{raw_message[:4000]}"
    )
    return {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "Repair the user content into strict JSON only.",
            },
            {
                "role": "user",
                "content": repair_prompt,
            },
        ],
        "temperature": 0,
    }


def _call_vlm_json(api_url: str, api_key: str, payload: dict[str, Any]) -> tuple[Optional[str], Optional[Dict[str, Any]]]:
    req = request.Request(
        _normalize_api_url(api_url),
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with request.urlopen(req, timeout=20.0) as response:
        data = json.loads(response.read().decode("utf-8"))

    message = data["choices"][0]["message"]["content"]
    if isinstance(message, list):
        text_parts = [part.get("text", "") for part in message if isinstance(part, dict)]
        message = "\n".join(part for part in text_parts if part)
    raw_message = message if isinstance(message, str) else ""
    return raw_message, _extract_json_block(raw_message)


def extract_vlm_hints(
    image_bytes: bytes,
) -> tuple[Optional[str], Optional[str], Optional[ShapeType], list[str], list[str], list[str], Optional[str], list[str]]:
    settings = get_vlm_settings()
    if not settings.enabled:
        return None, None, None, [], [], [], None, []

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    prompt = (
        "你正在帮助一个立体几何教学 MVP 识别题目图片。"
        "请优先完整提取图片中的中文题干，并只返回严格 JSON。"
        "recognizedText 是最重要字段，必须尽量填写成完整中文题干，宁可近似也不要留空。"
        "JSON 推荐包含键 recognizedText、diagramSummary、candidateShape、pointLabels、hiddenEdgeSuggestions、baseFaceLabels、apexLabel、warnings。"
        "recognizedText: 尽量逐字还原图片中的中文题干。"
        "diagramSummary: 用中文简要描述图形结构、关键点或明显空间关系。"
        "candidateShape: 如果能判断，填写 cuboid、prism、pyramid、unknown 之一。"
        "pointLabels: 如果能判断，返回点名数组；不能判断就返回空数组。"
        "hiddenEdgeSuggestions: 如果能判断，返回建议隐藏边数组；不能判断就返回空数组。"
        "baseFaceLabels: 如果能判断底面点顺序就返回数组，否则空数组。"
        "apexLabel: 如果能判断棱锥顶点名就返回，否则空字符串。"
        "warnings: 返回不确定项数组。"
        "不要输出 markdown，不要解释，只输出 JSON。"
    )

    try:
        raw_message, parsed = _call_vlm_json(
            settings.api_url,
            settings.api_key,
            _build_vlm_payload(settings.model, image_base64, prompt),
        )
    except (error.URLError, error.HTTPError, TimeoutError, socket.timeout, ValueError, Exception):
        return None, None, None, [], [], [], None, ["Configured VLM request failed; local heuristic recognition was used instead."]

    repair_warnings: list[str] = []
    if not parsed and raw_message:
        try:
            repaired_raw_message, repaired = _call_vlm_json(
                settings.api_url,
                settings.api_key,
                _build_json_repair_payload(settings.model, raw_message),
            )
            if repaired:
                raw_message = repaired_raw_message or raw_message
                parsed = repaired
                repair_warnings.append("VLM returned non-standard content; a JSON repair retry was applied.")
            else:
                repair_warnings.append("VLM JSON repair retry did not return usable JSON; best-effort fallback was used.")
        except (error.URLError, error.HTTPError, TimeoutError, socket.timeout, ValueError, Exception):
            repair_warnings.append("VLM JSON repair retry failed; best-effort local fallback was used.")

    if not parsed:
        text_candidates = _extract_chinese_text_candidates(raw_message)
        recognized_text = text_candidates[0] if text_candidates else None
        diagram_summary = text_candidates[1] if len(text_candidates) > 1 else None
        if recognized_text or diagram_summary:
            return recognized_text, diagram_summary, None, [], [], [], None, [
                *repair_warnings,
                "VLM returned non-standard content; best-effort text extraction was applied.",
            ]
        return None, None, None, [], [], [], None, [
            *repair_warnings,
            "Configured VLM returned an unreadable response; local heuristic recognition was used instead.",
        ]

    recognized_text = _fallback_text_from_parsed(parsed)
    diagram_summary = _fallback_summary_from_parsed(parsed)
    candidate_shape = _normalize_shape(str(parsed.get("candidateShape", "")))
    point_labels = _coerce_label_list(parsed.get("pointLabels", []))
    hidden_edge_suggestions = _coerce_label_list(parsed.get("hiddenEdgeSuggestions", []))
    base_face_labels = _coerce_label_list(parsed.get("baseFaceLabels", []))
    apex_label = str(parsed.get("apexLabel", "")).strip().upper() or None
    warnings = parsed.get("warnings", [])
    if not isinstance(warnings, list):
        warnings = []
    normalized_warnings = [*repair_warnings, *[str(item) for item in warnings]]

    if not recognized_text and raw_message:
        text_candidates = _extract_chinese_text_candidates(raw_message)
        if text_candidates:
            recognized_text = text_candidates[0]
            if not diagram_summary and len(text_candidates) > 1:
                diagram_summary = text_candidates[1]
            normalized_warnings.append("recognizedText was recovered from the raw AI response.")

    if not recognized_text and diagram_summary:
        recognized_text = diagram_summary
        normalized_warnings.append("recognizedText was missing, so diagramSummary was used as a text fallback.")

    return (
        recognized_text,
        diagram_summary,
        candidate_shape,
        point_labels,
        hidden_edge_suggestions,
        base_face_labels,
        apex_label,
        normalized_warnings,
    )
