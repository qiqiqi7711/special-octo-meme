// 「破茧」前端领域类型（camelCase）。
// 说明：接入真实后端时由 src/api.ts 适配层做 snake_case → camelCase 映射；
// mock 阶段直接使用这些类型，由 src/services/ 提供数据。

export type ExploreGoal =
  | "understand_mechanism" // 理解形成机制
  | "understand_perspectives" // 了解不同研究视角
  | "discover_directions" // 发现尚未了解的方向
  | "compare_evidence"; // 比较不同证据

export type DimensionStatus =
  | "not_started" // 待探索
  | "explored" // 已探索
  | "insufficient_evidence"; // 证据不足

export type EvidenceType =
  | "academic"
  | "news"
  | "official"
  | "report"
  | "data"
  | "commentary"
  | "unknown";

export interface Dimension {
  id: string;
  title: string;
  description: string;
  category: string;
  whyExplore: string;
  searchQuestions: string[];
  keywords: string[];
  status: DimensionStatus;
  priority: number;
}

export interface EvidenceCard {
  id: string;
  dimensionId: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string | null;
  evidenceType: EvidenceType;
  publishedAt: string | null;
  applicability: string;
  limitations: string;
  verified: boolean;
  verificationNote: string | null;
}

// 资料类型复用证据类型的取值，仅作来源分类
export type SourceType = EvidenceType;

export interface SourceDocument {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string | null;
  snippet: string;
  sourceType: SourceType;
  retrievedAt: string;
  isMock: boolean;
}

export interface TopicMap {
  topic: string;
  goal: ExploreGoal;
  generatedBy: "mock" | "backend";
  mock: boolean;
  dimensions: Dimension[];
  suggestedNext: string[];
  disclaimer: string | null;
}

export interface SourceDistributionItem {
  type: EvidenceType;
  label: string;
  count: number;
}

export interface DuplicateGroup {
  title: string;
  reason: string;
}

export interface ExplorationReport {
  topic: string;
  exploredDimensions: Dimension[];
  unexploredDimensions: Dimension[];
  sourceDistribution: SourceDistributionItem[];
  possibleDuplicates: DuplicateGroup[];
  openQuestions: string[];
  reflection: string;
}
