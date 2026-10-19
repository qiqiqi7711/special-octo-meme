// 与 FastAPI 后端通信的适配层。mock 阶段默认关闭（见 services/explorationService.ts 的 USE_MOCK）。
// 接入真实后端时：将 USE_MOCK 设为 false，并把后端 app/schemas.py 的枚举与本前端对齐。
import type { DimensionStatus, ExploreGoal, TopicMap } from "./types";

const API_BASE = "/api";

export interface HealthStatus {
  status: string;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const resp = await fetch(`${API_BASE}/health`);
  if (!resp.ok) {
    throw new Error(`请求失败 ${resp.status}`);
  }
  return (await resp.json()) as HealthStatus;
}

// 前端探索目标 → 后端目标（后端 ExploreGoal 后续需与本页面四项目标对齐）
const GOAL_TO_BACKEND: Record<ExploreGoal, string> = {
  understand_mechanism: "depth",
  understand_perspectives: "neutral",
  discover_directions: "breadth",
  compare_evidence: "verification",
};

// 后端维度状态 → 前端维度状态
const BACKEND_STATUS: Record<string, DimensionStatus> = {
  not_started: "not_started",
  in_progress: "not_started",
  done: "explored",
  skipped: "not_started",
};

interface BackendDimension {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  why_explore?: string;
  search_questions?: string[];
  keywords?: string[];
  status?: string;
  priority?: number;
}

interface BackendTopicMap {
  topic: string;
  mock: boolean;
  dimensions?: BackendDimension[];
  suggested_next?: string[];
  disclaimer?: string | null;
}

export async function generateTopicMapFromBackend(
  topic: string,
  goal: ExploreGoal
): Promise<TopicMap> {
  const resp = await fetch(`${API_BASE}/explore/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, goal: GOAL_TO_BACKEND[goal] }),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`请求失败 ${resp.status}: ${detail}`);
  }
  const data = (await resp.json()) as { topic_map: BackendTopicMap };
  const tm = data.topic_map;
  return {
    topic: tm.topic,
    goal,
    generatedBy: tm.mock ? "mock" : "backend",
    mock: tm.mock,
    dimensions: (tm.dimensions ?? []).map((d, i) => ({
      id: d.id ?? `d${i + 1}`,
      title: d.title,
      description: d.description ?? "",
      category: d.category ?? "",
      whyExplore: d.why_explore ?? "",
      searchQuestions: d.search_questions ?? [],
      keywords: d.keywords ?? [],
      status: BACKEND_STATUS[d.status ?? ""] ?? "not_started",
      priority: d.priority ?? i + 1,
    })),
    suggestedNext: tm.suggested_next ?? [],
    disclaimer: tm.disclaimer ?? null,
  };
}
