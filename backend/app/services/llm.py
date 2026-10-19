"""LLM 服务：OpenAI 兼容接口的统一封装。

- 通过 base_url / api_key / model 可配置到任意 OpenAI 兼容服务
  （OpenAI、DeepSeek、通义、Moonshot、Kimi 等）。
- 未配置 key、或调用/解析失败时，`generate_topic_map_json` 返回 None，
  由调用方回退到明确标记的 stub，绝不抛异常打断流程。
"""
from __future__ import annotations

import json
import logging
from typing import Any

from ..config import get_settings

logger = logging.getLogger(__name__)

_GOAL_HINT = {
    "breadth": "偏重覆盖不同维度的广度，尽量给出多角度方向",
    "depth": "偏重深入展开，方向之间更有递进和细节",
    "verification": "偏重可核验、可追溯事实的方向",
    "neutral": "无偏好，均衡给出方向",
}


def is_llm_configured() -> bool:
    return get_settings().llm_configured


def _build_prompt(topic: str, goal: str) -> str:
    hint = _GOAL_HINT.get(goal, "无偏好")
    return (
        "你是信息视野探索工具的分析引擎。请把用户的话题拆解为 4~7 个互不相同、"
        "值得进一步探索的『维度』。维度是探索方向假设，不是事实结论，"
        "因此不要编造任何数据、出处或结论。\n"
        f"话题：{topic}\n"
        f"探索目标：{hint}\n\n"
        "只输出 JSON，不要任何解释。JSON 结构如下：\n"
        '{"dimensions":[{"title":"...","description":"...","keywords":["..."],'
        '"priority":0}, ...], "suggested_next":["<维度序号，从1开始>", ...]}\n'
        "要求：\n"
        "1. title 简洁（≤12 字）；description 一句话说明该维度要探索什么（≤50 字）。\n"
        "2. keywords 给出 2~4 个用于检索的关键词。\n"
        "3. priority 为 1~5 的整数，表示建议的探索优先级。\n"
        "4. suggested_next 为建议最先探索的 1~2 个维度序号。\n"
    )


def generate_topic_map_json(topic: str, goal: str) -> dict[str, Any] | None:
    """调用 LLM 生成主题维度 JSON。未配置或调用失败时返回 None。"""
    settings = get_settings()
    if not settings.llm_configured:
        return None

    try:
        from openai import OpenAI  # 延迟导入：未安装 openai 不影响 stub 路径
    except ImportError:
        logger.warning("未安装 openai 包，回退到 stub。请执行 pip install openai")
        return None

    client = OpenAI(base_url=settings.llm_base_url, api_key=settings.llm_api_key)
    try:
        resp = client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": "你只输出合法 JSON。"},
                {"role": "user", "content": _build_prompt(topic, goal)},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
    except Exception as exc:  # noqa: BLE001 - 上游调用失败应回退而非崩溃
        logger.warning("LLM 调用失败，回退到 stub：%s", exc)
        return None

    content = (resp.choices[0].message.content or "").strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        logger.warning("LLM 返回非 JSON，回退到 stub")
        return None
