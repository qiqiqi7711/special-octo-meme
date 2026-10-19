"""检索服务：可配置的搜索 / 学术检索接口。

MVP 阶段仅提供 `stub` 实现（返回空、明确标记，不伪造任何来源）。
真实实现预留以下 provider，接入时实现 `SearchProvider.search` 即可，无需改动上层：
- serper / bing / google_cse（通用网页）
- semantic_scholar / arxiv / crossref（学术）
"""
from __future__ import annotations

from abc import ABC, abstractmethod

from ..schemas import EvidenceCard


class SearchProvider(ABC):
    """检索器统一接口。"""

    @abstractmethod
    def search(self, query: str, limit: int = 5) -> list[EvidenceCard]:
        """按查询词返回证据卡片列表（须为真实来源）。"""


class StubSearchProvider(SearchProvider):
    """占位实现：不返回任何伪造来源，仅作接口占位。"""

    def search(self, query: str, limit: int = 5) -> list[EvidenceCard]:
        return []


def get_search_provider() -> SearchProvider:
    from ..config import get_settings

    provider = get_settings().search_provider
    if provider == "stub":
        return StubSearchProvider()
    # TODO: 接入真实检索服务，例如 serper / bing / semantic_scholar / crossref
    raise NotImplementedError(f"尚未实现的检索服务：{provider}")
