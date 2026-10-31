"""核心数据结构（Pydantic 模型）。

设计要点：
- 「维度」(Dimension) 是模型生成的**探索方向假设**，不是事实；
- 「证据卡片」(EvidenceCard) 必须来自真实检索，携带来源、证据类型、适用条件与局限；
- 二者用 TopicMap.generated_by / mock / verified 明确区分，避免把假设当事实。
"""
from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class ExploreGoal(str, Enum):
    breadth = "breadth"            # 广度：了解全貌
    depth = "depth"                # 深度：深入某个方向
    verification = "verification"  # 核验：验证特定事实
    neutral = "neutral"            # 中性：无明确偏好


class DimensionStatus(str, Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    done = "done"
    skipped = "skipped"


class EvidenceType(str, Enum):
    academic = "academic"      # 学术论文 / 预印本
    news = "news"              # 新闻媒体
    official = "official"      # 官方 / 政府 / 机构公告
    report = "report"          # 行业 / 智库报告
    data = "data"              # 数据 / 统计
    commentary = "commentary"  # 评论 / 观点
    unknown = "unknown"        # 未知 / 待确认


class Dimension(BaseModel):
    id: str
    title: str
    description: str = ""
    keywords: list[str] = Field(default_factory=list)
    status: DimensionStatus = DimensionStatus.not_started
    priority: int = 0


class EvidenceCard(BaseModel):
    id: str
    dimension_id: str
    title: str
    summary: str = ""
    source_name: str
    source_url: str | None = None
    evidence_type: EvidenceType = EvidenceType.unknown
    published_at: str | None = None
    applicability: str | None = None   # 适用条件 / 边界
    limitations: str | None = None     # 局限
    verified: bool = False             # 是否已核验
    verification_note: str | None = None


class TopicMap(BaseModel):
    topic: str
    goal: ExploreGoal
    generated_by: str = "stub"          # "llm" | "stub"
    mock: bool = True                   # 标记：是否为模拟/占位数据
    mock_reason: str | None = None
    dimensions: list[Dimension] = Field(default_factory=list)
    suggested_next: list[str] = Field(default_factory=list)
    disclaimer: str | None = None


class ExploreRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    goal: ExploreGoal = ExploreGoal.neutral


class ExploreResponse(BaseModel):
    topic_map: TopicMap


class SourceDocument(BaseModel):
    """一条可追溯的真实来源（用于「该方向资料」列表）。"""

    id: str
    title: str
    url: str
    source_name: str
    published_at: str | None = None
    snippet: str = ""
    source_type: EvidenceType = EvidenceType.unknown
    retrieved_at: str | None = None
    is_mock: bool = True


class DimensionInput(BaseModel):
    """检索请求携带的维度信息（探索方向假设）。"""

    id: str
    title: str
    description: str = ""
    keywords: list[str] = Field(default_factory=list)


class EvidenceRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    dimension: DimensionInput
    offset: int = Field(0, ge=0)
    limit: int = Field(3, ge=1, le=10)


class EvidenceResponse(BaseModel):
    cards: list[EvidenceCard] = Field(default_factory=list)
    query: str | None = None
    has_more: bool = False


class SourcesRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    dimension: DimensionInput


class SourcesResponse(BaseModel):
    documents: list[SourceDocument] = Field(default_factory=list)
    query: str | None = None
