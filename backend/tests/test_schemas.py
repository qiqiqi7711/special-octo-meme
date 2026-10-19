import pytest
from pydantic import ValidationError

from app.schemas import ExploreGoal, ExploreRequest


def test_explore_request_valid():
    req = ExploreRequest(topic="人工智能对就业的影响", goal=ExploreGoal.breadth)
    assert req.topic == "人工智能对就业的影响"
    assert req.goal == ExploreGoal.breadth


def test_explore_request_empty_topic_rejected():
    with pytest.raises(ValidationError):
        ExploreRequest(topic="", goal="neutral")


def test_goal_defaults_to_neutral():
    req = ExploreRequest(topic="气候变化")
    assert req.goal == ExploreGoal.neutral


def test_topic_length_limit():
    with pytest.raises(ValidationError):
        ExploreRequest(topic="长" * 201, goal="neutral")
