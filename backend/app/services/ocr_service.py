from __future__ import annotations

from typing import Tuple

import cv2
import numpy as np

try:
    import pytesseract
except Exception:  # pragma: no cover
    pytesseract = None


def extract_text(image_bytes: bytes) -> Tuple[str, list[str]]:
    warnings: list[str] = []

    if pytesseract is None:
        warnings.append(
            "OCR unavailable in current environment; please enter or edit the problem text manually."
        )
        return "", warnings

    array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(array, cv2.IMREAD_COLOR)

    if image is None:
        warnings.append("Could not decode image for OCR.")
        return "", warnings

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    processed = cv2.GaussianBlur(gray, (3, 3), 0)

    try:
        text = pytesseract.image_to_string(processed).strip()
    except Exception:
        warnings.append(
            "OCR unavailable in current environment; please enter or edit the problem text manually."
        )
        return "", warnings

    if not text:
        warnings.append("No readable problem text was detected from the image.")

    return text, warnings

