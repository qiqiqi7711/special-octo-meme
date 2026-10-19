"""应用配置：从环境变量 / .env 读取。

所有密钥（LLM / 检索）只存在于服务端环境变量中，绝不暴露给前端。
"""
from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

# 从 backend 目录向上寻找 .env，兼容从项目根或 backend 目录启动
_BASE_DIR = Path(__file__).resolve().parent.parent
for _candidate in (_BASE_DIR / ".env", _BASE_DIR.parent / ".env"):
    if _candidate.exists():
        load_dotenv(_candidate)
        break
else:
    load_dotenv()  # 兜底：默认加载当前工作目录下的 .env


class Settings:
    """服务端配置。属性名与环境变量（大写）一一对应。"""

    def __init__(self) -> None:
        self.app_name: str = "破茧 · 信息视野探索"
        self.api_prefix: str = "/api"
        self.cors_origins: list[str] = [
            o.strip()
            for o in os.getenv(
                "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
            ).split(",")
            if o.strip()
        ]

        # LLM（OpenAI 兼容接口：base_url / api_key / model 均可配置）
        self.llm_api_key: str = os.getenv("LLM_API_KEY", "").strip()
        self.llm_base_url: str = os.getenv(
            "LLM_BASE_URL", "https://api.openai.com/v1"
        ).strip()
        self.llm_model: str = os.getenv("LLM_MODEL", "gpt-4o-mini").strip()

        # 检索（可配置 provider；MVP 仅有 stub，真实接口预留）
        self.search_provider: str = os.getenv("SEARCH_PROVIDER", "stub").strip()
        self.search_api_key: str = os.getenv("SEARCH_API_KEY", "").strip()

    @property
    def llm_configured(self) -> bool:
        return bool(self.llm_api_key)

    @property
    def search_configured(self) -> bool:
        return bool(self.search_api_key) and self.search_provider != "stub"


@lru_cache
def get_settings() -> Settings:
    return Settings()
