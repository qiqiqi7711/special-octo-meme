// 与 FastAPI 后端通信的适配层。
// 后端地址通过 VITE_API_BASE_URL 配置：本地开发用 /api（走 vite 代理），
// 部署时填后端完整地址（如 https://api.example.com/api）。
import type {
  Dimension,
  DimensionStatus,
  EvidenceCard,
  ExploreGoal,
  SourceDocument,
  SourceType,
  TopicMap,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

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

// 传给后端的维度信息（只取后端需要的字段，忽略前端多余的展示字段）。
export interface DimensionPayload {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

function toDimensionPayload(dimension: Dimension): DimensionPayload {
  return {
    id: dimension.id,
    title: dimension.title,
    description: dimension.description,
    keywords: dimension.keywords,
  };
}

interface BackendEvidence {
  id: string;
  dimension_id: string;
  title: string;
  summary?: string;
  source_name: string;
  source_url?: string | null;
  evidence_type?: string;
  published_at?: string | null;
  applicability?: string | null;
  limitations?: string | null;
  verified?: boolean;
  verification_note?: string | null;
}

function mapEvidence(e: BackendEvidence): EvidenceCard {
  return {
    id: e.id,
    dimensionId: e.dimension_id,
    title: e.title,
    summary: e.summary ?? "",
    sourceName: e.source_name,
    sourceUrl: e.source_url ?? null,
    evidenceType: (e.evidence_type ?? "unknown") as EvidenceCard["evidenceType"],
    publishedAt: e.published_at ?? null,
    applicability: e.applicability ?? "",
    limitations: e.limitations ?? "",
    verified: e.verified ?? false,
    verificationNote: e.verification_note ?? null,
  };
}

export async function loadEvidenceFromBackend(
  topic: string,
  dimension: Dimension,
  offset: number,
  limit = 3
): Promise<EvidenceCard[]> {
  const resp = await fetch(`${API_BASE}/explore/evidence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      dimension: toDimensionPayload(dimension),
      offset,
      limit,
    }),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`请求失败 ${resp.status}: ${detail}`);
  }
  const data = (await resp.json()) as { cards?: BackendEvidence[] };
  return (data.cards ?? []).map(mapEvidence);
}

interface BackendSourceDocument {
  id: string;
  title: string;
  url: string;
  source_name: string;
  published_at?: string | null;
  snippet?: string;
  source_type?: string;
  retrieved_at?: string | null;
  is_mock?: boolean;
}

export async function loadSourcesFromBackend(
  topic: string,
  dimension: Dimension
): Promise<SourceDocument[]> {
  const resp = await fetch(`${API_BASE}/explore/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, dimension: toDimensionPayload(dimension) }),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`请求失败 ${resp.status}: ${detail}`);
  }
  const data = (await resp.json()) as { documents?: BackendSourceDocument[] };
  return (data.documents ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    url: d.url,
    sourceName: d.source_name,
    publishedAt: d.published_at ?? null,
    snippet: d.snippet ?? "",
    sourceType: (d.source_type ?? "unknown") as SourceType,
    retrievedAt: d.retrieved_at ?? new Date().toISOString(),
    isMock: d.is_mock ?? false,
  }));
}
