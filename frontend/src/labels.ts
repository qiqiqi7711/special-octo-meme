// 集中管理界面文案与状态元数据，避免散落在组件里。
import type { DimensionStatus, EvidenceType, ExploreGoal } from "./types";

export const GOAL_LABELS: Record<ExploreGoal, string> = {
  understand_mechanism: "理解形成机制",
  understand_perspectives: "了解不同研究视角",
  discover_directions: "发现尚未了解的方向",
  compare_evidence: "比较不同证据",
};

export const GOAL_HINTS: Record<ExploreGoal, string> = {
  understand_mechanism: "搞清楚这件事是如何发生的",
  understand_perspectives: "看看不同研究与立场的看法",
  discover_directions: "找出你可能忽略的维度",
  compare_evidence: "对比证据的强弱与适用性",
};

export const STATUS_META: Record<DimensionStatus, { label: string; className: string }> = {
  not_started: { label: "待探索", className: "bg-slate-100 text-slate-600" },
  explored: { label: "已探索", className: "bg-emerald-100 text-emerald-700" },
  insufficient_evidence: { label: "证据不足", className: "bg-amber-100 text-amber-700" },
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  academic: "学术研究",
  news: "新闻报道",
  official: "官方文件",
  report: "机构报告",
  data: "统计数据",
  commentary: "观点评论",
  unknown: "待确认",
};
