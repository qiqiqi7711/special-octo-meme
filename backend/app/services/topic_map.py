"""主题探索地图生成：编排 LLM 与 stub 回退。"""
from __future__ import annotations

from ..schemas import Dimension, DimensionStatus, ExploreGoal, TopicMap
from . import llm

# 占位维度模板：仅描述「探索方向」本身，不含任何事实、数据或来源。
_STUB_TEMPLATES = [
    ("背景与现状", "这个话题当前的基本事实、历史脉络与发展现状", ["背景", "现状", "历史"]),
    ("主要争议", "围绕该话题存在哪些不同立场与关键分歧", ["争议", "立场", "分歧"]),
    ("数据与统计", "可以找到哪些可量化的数据、指标与统计口径", ["数据", "统计", "指标"]),
    ("政策与制度", "相关的政策、法律、行业规范与制度安排", ["政策", "法规", "制度"]),
    ("相关案例", "具有代表性的真实案例与事件", ["案例", "事件"]),
    ("多方观点", "不同群体、专家、亲历者的视角与诉求", ["观点", "视角", "利益相关方"]),
]


def _stub_topic_map(topic: str, goal: ExploreGoal, reason: str) -> TopicMap:
    dimensions = [
        Dimension(
            id=f"d{i + 1}",
            title=title,
            description=desc,
            keywords=list(kw),
            status=DimensionStatus.not_started,
            priority=i + 1,
        )
        for i, (title, desc, kw) in enumerate(_STUB_TEMPLATES)
    ]
    return TopicMap(
        topic=topic,
        goal=goal,
        generated_by="stub",
        mock=True,
        mock_reason=reason,
        dimensions=dimensions,
        suggested_next=["d1", "d2"],
        disclaimer=(
            "当前返回的是结构占位示例：维度仅为探索方向假设，不含任何事实或来源，"
            "用于演示端到端流程。配置 LLM_API_KEY 后，将由模型生成针对该话题的真实维度。"
        ),
    )


def _from_llm_json(topic: str, goal: ExploreGoal, raw: dict) -> TopicMap:
    dimensions = []
    for i, item in enumerate(raw.get("dimensions", []), start=1):
        priority_raw = item.get("priority", i)
        priority = int(priority_raw) if str(priority_raw).isdigit() else i
        dimensions.append(
            Dimension(
                id=f"d{i}",
                title=str(item.get("title", ""))[:200],
                description=str(item.get("description", ""))[:500],
                keywords=[str(k) for k in item.get("keywords", [])][:10],
                status=DimensionStatus.not_started,
                priority=priority,
            )
        )
    suggested = [str(s) for s in raw.get("suggested_next", [])]
    return TopicMap(
        topic=topic,
        goal=goal,
        generated_by="llm",
        mock=False,
        mock_reason=None,
        dimensions=dimensions,
        suggested_next=suggested,
        disclaimer=(
            "维度由模型生成，仅代表探索方向假设，不代表事实结论；"
            "其中的事实与来源需经检索与核验后方可采信。"
        ),
    )


def generate_topic_map(topic: str, goal: ExploreGoal) -> TopicMap:
    """生成主题探索地图。LLM 可用则用 LLM，否则回退到明确标记的占位数据。"""
    if llm.is_llm_configured():
        raw = llm.generate_topic_map_json(topic, goal.value)
        if raw is not None:
            try:
                return _from_llm_json(topic, goal, raw)
            except (KeyError, TypeError, ValueError):
                pass  # 解析异常回退 stub
        return _stub_topic_map(topic, goal, "LLM_API_KEY 已配置，但调用/解析失败，已回退")
    return _stub_topic_map(topic, goal, "LLM_API_KEY 未配置")
