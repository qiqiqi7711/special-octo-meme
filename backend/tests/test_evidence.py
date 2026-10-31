"""证据检索服务的单元测试（不依赖网络，仅覆盖纯逻辑与 stub 路径）。"""
from app.schemas import DimensionInput, EvidenceRequest, EvidenceType
from app.services.evidence import (
    build_search_query,
    classify_evidence_type,
    search_evidence,
)


def test_build_search_query_includes_topic_title_keywords():
    dim = DimensionInput(id="d1", title="概念与测量", keywords=["定义", "测量"])
    query = build_search_query("信息茧房", dim)
    assert "信息茧房" in query
    assert "概念与测量" in query
    assert "定义" in query


def test_build_search_query_dedupes_overlapping_keywords():
    dim = DimensionInput(id="d1", title="算法推荐", keywords=["算法推荐", "排序"])
    query = build_search_query("信息茧房", dim)
    # 关键词与标题重复时不应重复出现两次
    assert query.count("算法推荐") == 1


def test_classify_evidence_type_known_domains():
    assert classify_evidence_type("https://arxiv.org/abs/1234.5678") == EvidenceType.academic
    assert classify_evidence_type("https://www.gov.cn/xinwen/2024.htm") == EvidenceType.official
    assert classify_evidence_type("https://ourworldindata.org/foo") == EvidenceType.data


def test_classify_evidence_type_unknown_domain():
    assert classify_evidence_type("https://example.com/some-page") == EvidenceType.unknown


def test_search_evidence_stub_returns_empty():
    # 未配置密钥 / provider=stub 时返回空，不抛异常、不伪造来源
    dim = DimensionInput(id="d1", title="概念与测量")
    assert search_evidence("信息茧房", dim, 0, 3) == []


def test_evidence_request_defaults():
    req = EvidenceRequest(topic="信息茧房", dimension=DimensionInput(id="d1", title="t"))
    assert req.offset == 0
    assert req.limit == 3
