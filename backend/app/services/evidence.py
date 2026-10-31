"""证据检索服务：把维度（探索方向假设）转换为检索式，调用真实检索并映射为证据卡片。

核心约定（与项目「不虚构来源」约束一致）：
- 证据卡片只来自真实检索返回的标题 / 链接 / 摘要，绝不编造；
- 所有自动检索结果 `verified=False`，并附 `verification_note` 说明「未经人工逐条核验」；
- 证据类型（evidence_type）按域名做启发式判断，无法判断时保守标记 `unknown`。
"""
from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urlparse

from ..schemas import DimensionInput, EvidenceCard, EvidenceType, SourceDocument
from .search import SearchHit, get_search_provider

# 证据类型启发式：仅识别高度可信的域名特征，其余保守归为 unknown。
_ACADEMIC_HINTS = (
    "arxiv.org", "doi.org", "semanticscholar.org", "scholar.google", ".edu",
    "springer.com", "nature.com", "sciencedirect.com", "paperswithcode.com",
    "cnki.net", "wanfangdata", ".edu.cn",
)
_OFFICIAL_HINTS = (".gov", ".mil", "un.org", "who.int", "europa.eu")
_NEWS_HINTS = (
    "bbc", "reuters", "apnews", "nytimes", "theguardian", "xinhuanet",
    "people.com.cn", "chinadaily", "caixin", "thepaper.cn",
)
_DATA_HINTS = (
    "ourworldindata", "statista", "data.", "stats.", "ceicdata",
    "worldbank", "gapminder",
)


def classify_evidence_type(url: str) -> EvidenceType:
    """按域名对证据类型做启发式分类；无法判断时返回 unknown。"""
    host = urlparse(url).netloc.lower()
    if any(h in host for h in _ACADEMIC_HINTS):
        return EvidenceType.academic
    if any(h in host for h in _OFFICIAL_HINTS):
        return EvidenceType.official
    if any(h in host for h in _DATA_HINTS):
        return EvidenceType.data
    if any(h in host for h in _NEWS_HINTS):
        return EvidenceType.news
    return EvidenceType.unknown


def build_search_query(topic: str, dimension: DimensionInput) -> str:
    """用「话题 + 维度标题 + 关键词」构造检索式。"""
    parts: list[str] = [topic, dimension.title]
    for kw in dimension.keywords[:3]:
        if kw and kw not in parts:
            parts.append(kw)
    return " ".join(p.strip() for p in parts if p and p.strip())


def _hit_to_card(
    topic: str, dimension: DimensionInput, idx: int, hit: SearchHit
) -> EvidenceCard:
    del topic  # 检索式已包含话题，卡片本身不重复携带话题字段
    return EvidenceCard(
        id=f"{dimension.id}-e{idx + 1}",
        dimension_id=dimension.id,
        title=hit.title or hit.source_name or hit.url,
        summary=hit.snippet,
        source_name=hit.source_name,
        source_url=hit.url,
        evidence_type=classify_evidence_type(hit.url),
        published_at=hit.published_at,
        applicability=None,
        limitations=None,
        verified=False,
        verification_note="自动检索结果：来源与链接为真实检索返回，但未经人工逐条核验。",
    )


def search_evidence(
    topic: str, dimension: DimensionInput, offset: int, limit: int = 3
) -> list[EvidenceCard]:
    """按维度检索证据卡片。offset 用于给卡片生成稳定且递增的 id。"""
    provider = get_search_provider()
    query = build_search_query(topic, dimension)
    hits = provider.search(query, limit=limit)
    return [_hit_to_card(topic, dimension, offset + i, hit) for i, hit in enumerate(hits)]


def search_sources(topic: str, dimension: DimensionInput) -> list[SourceDocument]:
    """按维度检索来源文档（SourceDocument）。"""
    provider = get_search_provider()
    query = build_search_query(topic, dimension)
    hits = provider.search(query, limit=6)
    now = datetime.now(timezone.utc).isoformat()
    docs: list[SourceDocument] = []
    for i, hit in enumerate(hits):
        docs.append(
            SourceDocument(
                id=f"{dimension.id}-s{i + 1}",
                title=hit.title or hit.source_name or hit.url,
                url=hit.url,
                source_name=hit.source_name,
                published_at=hit.published_at,
                snippet=hit.snippet,
                source_type=classify_evidence_type(hit.url),
                retrieved_at=now,
                is_mock=False,
            )
        )
    return docs
