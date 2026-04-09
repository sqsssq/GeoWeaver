from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class VLMSettings:
    api_key: str = ""
    model: str = ""
    api_url: str = ""

    @property
    def enabled(self) -> bool:
        return bool(self.api_key and self.model and self.api_url)


def get_vlm_settings() -> VLMSettings:
    return VLMSettings(
        api_key=os.getenv("QWEN_API_KEY", "").strip(),
        model=os.getenv("QWEN_MODEL", "").strip(),
        api_url=os.getenv("QWEN_API_URL", "").strip(),
    )
