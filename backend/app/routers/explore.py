from fastapi import APIRouter

from ..schemas import (
    EvidenceRequest,
    EvidenceResponse,
    ExploreRequest,
    ExploreResponse,
    SourcesRequest,
    SourcesResponse,
)
from ..services.evidence import build_search_query, search_evidence, search_sources
from ..services.topic_map import generate_topic_map

router = APIRouter(prefix="/explore", tags=["explore"])


@router.post("/topics", response_model=ExploreResponse)
def create_topic_map(req: ExploreRequest) -> ExploreResponse:
    """输入话题 → 生成结构化主题探索地图。"""
    topic_map = generate_topic_map(req.topic, req.goal)
    return ExploreResponse(topic_map=topic_map)


@router.post("/evidence", response_model=EvidenceResponse)
def get_evidence(req: EvidenceRequest) -> EvidenceResponse:
    """按维度检索证据卡片（来自真实检索，未经人工核验）。"""
    query = build_search_query(req.topic, req.dimension)
    cards = search_evidence(req.topic, req.dimension, req.offset, req.limit)
    return EvidenceResponse(cards=cards, query=query, has_more=len(cards) == req.limit)


@router.post("/sources", response_model=SourcesResponse)
def get_sources(req: SourcesRequest) -> SourcesResponse:
    """按维度检索来源文档列表（真实来源）。"""
    query = build_search_query(req.topic, req.dimension)
    documents = search_sources(req.topic, req.dimension)
    return SourcesResponse(documents=documents, query=query)
