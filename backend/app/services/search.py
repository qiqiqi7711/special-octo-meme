"""检索服务：可配置的搜索 / 学术检索接口。

真实实现通过 HTTP 调用第三方搜索 API，返回**可追溯的真实来源**（标题 + 链接 + 摘要）。
所有检索结果默认 `verified=False`：它们是真实来源，但未经人工逐条核验。

接入的 provider：
- tavily：面向 LLM 的搜索 API（默认，免费额度 1000 次/月，适合本项目的证据卡片场景）
- brave ：Brave Search API（免费额度 2000 次/月）
- stub  ：占位实现，返回空、不伪造任何来源，用于未配置密钥时的兜底
"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from urllib.parse import urlparse

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)


@dataclass
class SearchHit:
    """单条检索命中：仅承载来源本身的可追溯信息，不含任何推断。"""

    title: str
    url: str
    snippet: str = ""
    source_name: str = ""
    published_at: str | None = None


class SearchProvider(ABC):
    """检索器统一接口。"""

    @abstractmethod
    def search(self, query: str, limit: int = 5) -> list[SearchHit]:
        """按查询词返回真实检索结果（须为真实来源）。"""


class StubSearchProvider(SearchProvider):
    """占位实现：不返回任何伪造来源，仅作接口占位。"""

    def search(self, query: str, limit: int = 5) -> list[SearchHit]:
        return []


def source_name_from_url(url: str) -> str:
    """从 URL 提取站点名，用于展示来源。"""
    try:
        return urlparse(url).netloc.lstrip("www.") or "未知来源"
    except ValueError:
        return "未知来源"


class TavilySearchProvider(SearchProvider):
    """Tavily Search API（https://tavily.com，面向 LLM 的检索服务）。"""

    endpoint = "https://api.tavily.com/search"

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def search(self, query: str, limit: int = 5) -> list[SearchHit]:
        try:
            resp = httpx.post(
                self.endpoint,
                json={
                    "api_key": self.api_key,
                    "query": query,
                    "max_results": limit,
                    "search_depth": "basic",
                },
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()
        except Exception as exc:  # noqa: BLE001 - 上游失败应返回空而非崩溃
            logger.warning("Tavily 检索失败：%s", exc)
            return []

        hits: list[SearchHit] = []
        for r in data.get("results", []):
            url = str(r.get("url") or "")
            if not url:
                continue
            hits.append(
                SearchHit(
                    title=str(r.get("title") or "")[:300],
                    url=url,
                    snippet=str(r.get("content") or "")[:600],
                    source_name=source_name_from_url(url),
                    published_at=(
                        str(r.get("published_date")) if r.get("published_date") else None
                    ),
                )
            )
        return hits[:limit]


class BraveSearchProvider(SearchProvider):
    """Brave Search API（https://brave.com/search/api/，免费额度 2000 次/月）。"""

    endpoint = "https://api.search.brave.com/res/v1/web/search"

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def search(self, query: str, limit: int = 5) -> list[SearchHit]:
        try:
            resp = httpx.get(
                self.endpoint,
                params={"q": query, "count": min(limit, 20)},
                headers={"X-Subscription-Token": self.api_key, "Accept": "application/json"},
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()
        except Exception as exc:  # noqa: BLE001 - 上游失败应返回空而非崩溃
            logger.warning("Brave 检索失败：%s", exc)
            return []

        hits: list[SearchHit] = []
        for r in data.get("web", {}).get("results", []):
            url = str(r.get("url") or "")
            if not url:
                continue
            hits.append(
                SearchHit(
                    title=str(r.get("title") or "")[:300],
                    url=url,
                    snippet=str(r.get("description") or "")[:600],
                    source_name=source_name_from_url(url),
                    published_at=None,
                )
            )
        return hits[:limit]


def get_search_provider() -> SearchProvider:
    settings = get_settings()
    provider = settings.search_provider
    key = settings.search_api_key

    if provider == "tavily":
        if key:
            return TavilySearchProvider(key)
        logger.warning("SEARCH_PROVIDER=tavily 但未配置 SEARCH_API_KEY，回退到 stub")
        return StubSearchProvider()
    if provider == "brave":
        if key:
            return BraveSearchProvider(key)
        logger.warning("SEARCH_PROVIDER=brave 但未配置 SEARCH_API_KEY，回退到 stub")
        return StubSearchProvider()
    if provider == "stub":
        return StubSearchProvider()
    logger.warning("未知检索服务 %s，回退到 stub", provider)
    return StubSearchProvider()
