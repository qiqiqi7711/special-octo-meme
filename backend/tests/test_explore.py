from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_explore_returns_marked_stub_when_no_llm():
    """未配置 LLM_API_KEY 时应返回明确标记的占位数据，且不含伪造来源。"""
    resp = client.post("/api/explore/topics", json={"topic": "信息茧房", "goal": "neutral"})
    assert resp.status_code == 200
    body = resp.json()
    tm = body["topic_map"]

    assert tm["mock"] is True
    assert tm["generated_by"] == "stub"
    assert tm["mock_reason"]
    assert tm["disclaimer"]
    assert len(tm["dimensions"]) >= 1

    # 占位维度是「探索方向」，不允许夹带伪造的来源链接或证据
    for d in tm["dimensions"]:
        assert d.get("source_url") is None


def test_explore_invalid_goal_rejected():
    resp = client.post("/api/explore/topics", json={"topic": "信息茧房", "goal": "bad"})
    assert resp.status_code == 422
