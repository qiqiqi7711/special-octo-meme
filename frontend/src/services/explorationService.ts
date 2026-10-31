// 服务门面：UI 只依赖这里的函数，不直接接触 mock 或 HTTP 细节。
// 是否使用 mock 由构建环境变量 VITE_USE_MOCK 决定（"true" 则走 mock，否则走真实后端）。
import {
  generateTopicMapFromBackend,
  loadEvidenceFromBackend,
  loadSourcesFromBackend,
} from "../api";
import { EVIDENCE_TYPE_LABELS } from "../labels";
import type {
  Dimension,
  EvidenceCard,
  ExplorationReport,
  ExploreGoal,
  SourceDistributionItem,
  SourceDocument,
  TopicMap,
} from "../types";
import { buildMockTopicMap, getMockEvidence, getMockReportExtras, getMockSources } from "./mockData";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

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
  dimension: Dimension,
  offset: number,
  limit = 3
): Promise<EvidenceCard[]> {
  if (USE_MOCK) {
    await delay(300);
    return getMockEvidence(topic, dimension.id, offset, limit);
  }
  return loadEvidenceFromBackend(topic, dimension, offset, limit);
}

export async function loadSources(
  topic: string,
  dimension: Dimension
): Promise<SourceDocument[]> {
  if (USE_MOCK) {
    await delay(400);
    return getMockSources(topic, dimension.id);
  }
  return loadSourcesFromBackend(topic, dimension);
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

  // 真实模式下不混入 mock 的「重复来源 / 开放问题」，留待阶段二基于真实数据计算。
  const extras = USE_MOCK ? getMockReportExtras(topicMap.topic) : { possibleDuplicates: [], openQuestions: [] };

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
