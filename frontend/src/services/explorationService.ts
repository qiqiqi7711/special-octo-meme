// 服务门面：UI 只依赖这里的函数，不直接接触 mock 或 HTTP 细节。
// 切换 USE_MOCK = false 即可接入真实 FastAPI 后端。
import { generateTopicMapFromBackend } from "../api";
import { EVIDENCE_TYPE_LABELS } from "../labels";
import type {
  EvidenceCard,
  ExplorationReport,
  ExploreGoal,
  SourceDistributionItem,
  SourceDocument,
  TopicMap,
} from "../types";
import { buildMockTopicMap, getMockEvidence, getMockReportExtras, getMockSources } from "./mockData";

export const USE_MOCK = true;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateTopicMap(topic: string, goal: ExploreGoal): Promise<TopicMap> {
  if (USE_MOCK) {
    await delay(600); // 模拟生成耗时，便于演示 loading 态
    return buildMockTopicMap(topic, goal);
  }
  return generateTopicMapFromBackend(topic, goal);
}

export async function loadEvidence(
  topic: string,
  dimensionId: string,
  offset: number,
  limit = 3
): Promise<EvidenceCard[]> {
  if (USE_MOCK) {
    await delay(300);
    return getMockEvidence(topic, dimensionId, offset, limit);
  }
  // TODO: 接入后端证据检索接口（GET /api/explore/evidence?dimension_id=...）
  return [];
}

export async function loadSources(
  topic: string,
  directionId: string
): Promise<SourceDocument[]> {
  if (USE_MOCK) {
    await delay(400);
    return getMockSources(topic, directionId);
  }
  // TODO: 接入后端检索接口（返回 SourceDocument 列表）
  return [];
}

export function buildReport(input: {
  topicMap: TopicMap;
  evidenceByDimension: Record<string, EvidenceCard[]>;
  reflection: string;
}): ExplorationReport {
  const { topicMap, evidenceByDimension, reflection } = input;

  const explored = topicMap.dimensions.filter((d) => d.status === "explored");
  const unexplored = topicMap.dimensions.filter((d) => d.status !== "explored");

  // 来源分布：基于已加载证据的真实聚合
  const counts = new Map<EvidenceCard["evidenceType"], number>();
  for (const cards of Object.values(evidenceByDimension)) {
    for (const c of cards) {
      counts.set(c.evidenceType, (counts.get(c.evidenceType) ?? 0) + 1);
    }
  }
  const order: EvidenceCard["evidenceType"][] = [
    "academic",
    "report",
    "data",
    "news",
    "official",
    "commentary",
  ];
  const sourceDistribution: SourceDistributionItem[] = order
    .filter((t) => (counts.get(t) ?? 0) > 0)
    .map((t) => ({ type: t, label: EVIDENCE_TYPE_LABELS[t], count: counts.get(t)! }));

  const extras = getMockReportExtras(topicMap.topic);

  return {
    topic: topicMap.topic,
    exploredDimensions: explored,
    unexploredDimensions: unexplored,
    sourceDistribution,
    possibleDuplicates: extras.possibleDuplicates,
    openQuestions: extras.openQuestions,
    reflection,
  };
}
