from __future__ import annotations

from collections.abc import Mapping
from functools import lru_cache
from typing import Any, Tuple

import cv2
import numpy as np

try:
    import pytesseract
except Exception:  # pragma: no cover
    pytesseract = None


def _decode_image(image_bytes: bytes) -> tuple[np.ndarray | None, list[str]]:
    array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(array, cv2.IMREAD_COLOR)

    if image is None:
        return None, ["Could not decode image for OCR."]

    return image, []


@lru_cache(maxsize=1)
def _get_paddle_ocr() -> tuple[Any | None, str | None]:
    try:
        from paddleocr import PaddleOCR
    except Exception as exc:  # pragma: no cover
        return None, f"PaddleOCR unavailable in current environment: {exc}"

    constructor_attempts = [
        {
            "lang": "ch",
            "device": "cpu",
            "use_doc_orientation_classify": False,
            "use_doc_unwarping": False,
            "use_textline_orientation": False,
        },
        {"lang": "ch", "use_angle_cls": True, "show_log": False},
        {"lang": "ch"},
    ]

    last_error: Exception | None = None
    for kwargs in constructor_attempts:
        try:
            return PaddleOCR(**kwargs), None
        except Exception as exc:  # pragma: no cover
            last_error = exc

    return None, f"PaddleOCR initialization failed: {last_error}"


def _collect_paddle_text(value: Any) -> list[str]:
    if value is None:
        return []

    if isinstance(value, str):
        stripped = value.strip()
        return [stripped] if stripped else []

    if isinstance(value, Mapping):
        if "res" in value:
            return _collect_paddle_text(value["res"])
        if "rec_texts" in value:
            rec_texts = value.get("rec_texts")
            rec_scores = value.get("rec_scores")
            if not isinstance(rec_texts, list):
                return []
            texts: list[str] = []
            for index, item in enumerate(rec_texts):
                score = rec_scores[index] if isinstance(rec_scores, list) and index < len(rec_scores) else 1.0
                if isinstance(score, (int, float)) and score < 0.45:
                    continue
                texts.extend(_collect_paddle_text(item))
            return texts
        for key in ("texts", "text", "label"):
            if key in value:
                return _collect_paddle_text(value[key])
        return []

    if isinstance(value, tuple) and value and isinstance(value[0], str):
        if len(value) > 1 and isinstance(value[1], (int, float)) and value[1] < 0.45:
            return []
        return _collect_paddle_text(value[0])

    if isinstance(value, (list, tuple)):
        texts: list[str] = []
        for item in value:
            texts.extend(_collect_paddle_text(item))
        return texts

    json_value = getattr(value, "json", None)
    if isinstance(json_value, (dict, list, tuple)):
        return _collect_paddle_text(json_value)
    if callable(json_value):
        try:
            return _collect_paddle_text(json_value())
        except Exception:
            return []

    return []


def _run_paddle_ocr(image: np.ndarray) -> tuple[str, list[str]]:
    warnings: list[str] = []
    paddle_ocr, paddle_warning = _get_paddle_ocr()
    if paddle_ocr is None:
        if paddle_warning:
            warnings.append(paddle_warning)
        return "", warnings

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    try:
        if hasattr(paddle_ocr, "predict"):
            result = paddle_ocr.predict(
                rgb_image,
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_textline_orientation=False,
            )
        else:
            result = paddle_ocr.ocr(rgb_image, cls=True)
    except TypeError:
        try:
            result = paddle_ocr.predict(rgb_image) if hasattr(paddle_ocr, "predict") else paddle_ocr.ocr(rgb_image)
        except Exception as exc:
            warnings.append(f"PaddleOCR recognition failed: {exc}")
            return "", warnings
    except Exception as exc:
        warnings.append(f"PaddleOCR recognition failed: {exc}")
        return "", warnings

    lines = _collect_paddle_text(result)
    text = "\n".join(line for line in lines if line).strip()
    if not text:
        warnings.append("PaddleOCR did not detect readable problem text.")

    return text, warnings


def _run_tesseract_ocr(image: np.ndarray) -> tuple[str, list[str]]:
    warnings: list[str] = []

    if pytesseract is None:
        warnings.append(
            "Tesseract OCR unavailable in current environment; please enter or edit the problem text manually."
        )
        return "", warnings


    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    processed = cv2.GaussianBlur(gray, (3, 3), 0)

    try:
        text = pytesseract.image_to_string(processed).strip()
    except Exception:
        warnings.append(
            "Tesseract OCR unavailable in current environment; please enter or edit the problem text manually."
        )
        return "", warnings

    if not text:
        warnings.append("Tesseract OCR did not detect readable problem text.")

    return text, warnings


def extract_text(image_bytes: bytes) -> Tuple[str, list[str]]:
    image, warnings = _decode_image(image_bytes)
    if image is None:
        warnings.append("Problem text can still be entered manually.")
        return "", warnings

    paddle_text, paddle_warnings = _run_paddle_ocr(image)
    warnings.extend(paddle_warnings)
    if paddle_text:
        if paddle_warnings:
            warnings.append("PaddleOCR returned text after recoverable warnings.")
        return paddle_text, warnings

    tesseract_text, tesseract_warnings = _run_tesseract_ocr(image)
    warnings.extend(tesseract_warnings)
    if tesseract_text:
        warnings.append("PaddleOCR was unavailable or empty; Tesseract OCR fallback returned text.")
        return tesseract_text, warnings

    warnings.append("No readable problem text was detected from the image; please enter or edit the text manually.")
    return "", warnings
