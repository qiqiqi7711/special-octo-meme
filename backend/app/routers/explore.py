from fastapi import APIRouter

from ..schemas import ExploreRequest, ExploreResponse
from ..services.topic_map import generate_topic_map

router = APIRouter(prefix="/explore", tags=["explore"])


@router.post("/topics", response_model=ExploreResponse)
def create_topic_map(req: ExploreRequest) -> ExploreResponse:
    """输入话题 → 生成结构化主题探索地图。"""
    topic_map = generate_topic_map(req.topic, req.goal)
    return ExploreResponse(topic_map=topic_map)
