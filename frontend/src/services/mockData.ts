// 明确标注的模拟数据层。
// 所有来源名/链接均为占位（example.com），不代表真实文献或事实；
// 接入真实后端后，本文件将被 services/explorationService.ts 中的真实实现替换。
import type {
  Dimension,
  DimensionStatus,
  DuplicateGroup,
  EvidenceCard,
  EvidenceType,
  ExploreGoal,
  SourceDocument,
  TopicMap,
} from "../types";

export const EXAMPLE_TOPICS = ["信息茧房", "青少年短视频使用", "算法推荐"];

interface DimensionSpec {
  title: string;
  description: string;
  category: string;
  whyExplore: string;
  keywords: string[];
  status: DimensionStatus;
}

interface TopicConfig {
  dimensions: DimensionSpec[];
  duplicates: DuplicateGroup[];
  openQuestions: string[];
}

const TOPIC_CONFIGS: Record<string, TopicConfig> = {
  信息茧房: {
    dimensions: [
      { title: "概念与测量", description: "信息茧房的定义、测量方式及其学术争议", category: "概念", whyExplore: "先厘清“信息茧房”到底指什么、如何测量，才能判断后续讨论是否成立。", keywords: ["定义", "测量", "选择性接触"], status: "not_started" },
      { title: "形成机制", description: "算法、个人选择与社会结构如何共同导致信息窄化", category: "机制", whyExplore: "理解算法、个人选择与社会结构如何共同导致信息窄化，是寻找应对办法的前提。", keywords: ["算法推荐", "选择性接触", "同质化"], status: "not_started" },
      { title: "影响后果", description: "信息茧房对认知、态度与公共讨论的可能影响", category: "影响", whyExplore: "判断信息茧房是否真的会加剧极化或削弱公共讨论，需要看后果证据。", keywords: ["极化", "认知偏差", "公共讨论"], status: "not_started" },
      { title: "相关数据", description: "关于信息接触多样性与茧房程度的实证数据", category: "数据", whyExplore: "用可量化的数据检验“茧房”是否存在、程度如何，避免停留在印象层面。", keywords: ["数据", "统计", "测量"], status: "not_started" },
      { title: "应对与干预", description: "打破信息茧房的工具、设计与干预研究", category: "干预", whyExplore: "了解已有的破茧工具与干预研究，评估它们是否真的有效。", keywords: ["干预", "设计", "多样性"], status: "insufficient_evidence" },
      { title: "争议与反思", description: "信息茧房是否存在、是否被夸大的学术争论", category: "争议", whyExplore: "学界对信息茧房是否存在、是否被夸大仍有分歧，需要对照双方证据。", keywords: ["争议", "反思", "证据强度"], status: "not_started" },
    ],
    duplicates: [
      { title: "多篇综述反复引用同一早期定义", reason: "三处来源沿用同一篇原始文献，未提供新的独立证据" },
      { title: "某组统计数字被不同媒体重复转载", reason: "同一来源被多次转述，存在重复计数" },
    ],
    openQuestions: [
      "信息茧房的概念边界与测量标准尚未统一",
      "算法推荐对信息茧房的因果贡献尚缺乏一致证据",
      "干预措施能否在真实场景中持续有效，证据有限",
    ],
  },
  青少年短视频使用: {
    dimensions: [
      { title: "使用现状", description: "青少年短视频使用的时长、频率与群体分布现状", category: "现状", whyExplore: "先了解青少年短视频使用的时长、频率与群体分布，建立事实基础。", keywords: ["使用时长", "群体分布", "现状"], status: "not_started" },
      { title: "心理机制", description: "短视频吸引力的心理与行为机制，如即时反馈与沉浸", category: "机制", whyExplore: "理解短视频为何吸引青少年，才能区分问题性使用与正常娱乐。", keywords: ["即时反馈", "注意力", "心理机制"], status: "not_started" },
      { title: "学业影响", description: "短视频使用对学习、注意力与睡眠的可能影响", category: "影响", whyExplore: "评估短视频使用对学习、注意力与睡眠的影响大小与证据强度。", keywords: ["学业", "注意力", "睡眠"], status: "not_started" },
      { title: "家长与监管", description: "家长引导、平台防沉迷措施与实际效果", category: "政策", whyExplore: "了解家长引导与平台防沉迷措施，判断哪些做法真正有效。", keywords: ["防沉迷", "家长", "监管"], status: "not_started" },
      { title: "平台算法", description: "推荐算法如何影响青少年内容接触与使用时长", category: "平台", whyExplore: "探究推荐算法如何影响青少年内容接触，这部分往往缺少公开数据。", keywords: ["推荐算法", "内容分发"], status: "insufficient_evidence" },
      { title: "干预研究", description: "减少问题性使用、提升自控的干预方案与证据", category: "干预", whyExplore: "寻找减少问题性使用、提升自控的干预方案及其证据。", keywords: ["干预", "自控", "证据"], status: "not_started" },
    ],
    duplicates: [
      { title: "多篇报道引用同一份使用时长统计", reason: "同一来源被不同媒体转述，存在重复计数" },
      { title: "不同综述重复综述同一批干预实验", reason: "二手综述互相引用，原始实验数量有限" },
    ],
    openQuestions: [
      "青少年短视频使用的长期效应证据仍不足",
      "防沉迷措施的实际效果缺少独立评估",
      "平台算法对内容接触的具体影响难以获取平台内部数据",
    ],
  },
  算法推荐: {
    dimensions: [
      { title: "推荐机制", description: "算法推荐的技术原理与目标函数设计", category: "机制", whyExplore: "理解推荐系统的目标函数与排序原理，是讨论其影响的起点。", keywords: ["推荐系统", "排序", "目标函数"], status: "not_started" },
      { title: "过滤气泡", description: "算法推荐是否导致信息窄化与过滤气泡", category: "影响", whyExplore: "检验算法推荐是否真的导致信息窄化与过滤气泡。", keywords: ["过滤气泡", "信息窄化", "多样性"], status: "not_started" },
      { title: "平台责任", description: "平台在内容分发中的责任边界与治理义务", category: "政策", whyExplore: "厘清平台在内容分发中的责任边界与治理义务。", keywords: ["平台责任", "治理", "伦理"], status: "not_started" },
      { title: "用户感知", description: "用户对算法推荐的感知、信任与掌控感", category: "感知", whyExplore: "了解用户对算法的感知与掌控感，评估透明化措施的实际效果。", keywords: ["用户感知", "透明度", "信任"], status: "not_started" },
      { title: "监管政策", description: "各国对算法推荐与内容分发的监管政策", category: "政策", whyExplore: "对比各国对算法推荐的监管思路，判断可借鉴之处。", keywords: ["监管", "立法", "算法治理"], status: "insufficient_evidence" },
      { title: "实证研究", description: "关于算法推荐影响的实证测量与因果研究", category: "实证", whyExplore: "聚焦关于算法推荐影响的实证测量与因果识别。", keywords: ["实证", "因果", "测量"], status: "not_started" },
    ],
    duplicates: [
      { title: "同一批实验室研究被多篇综述重复引用", reason: "二手引用密集，独立原始证据有限" },
      { title: "某平台透明度报告的统计被反复转述", reason: "单一来源被多次引用，存在重复" },
    ],
    openQuestions: [
      "算法推荐与信息茧房的因果方向尚不明确",
      "缺少平台内部数据，外部研究难以直接验证推荐机制",
      "监管政策的效果评估证据稀缺",
    ],
  },
};

const GENERIC_CONFIG: TopicConfig = {
  dimensions: [
    { title: "概念与界定", description: "该话题的核心概念、边界与常见定义", category: "概念", whyExplore: "先厘清核心概念与边界，避免后续讨论各说各话。", keywords: ["概念", "定义", "边界"], status: "not_started" },
    { title: "现状与背景", description: "该话题当前的基本事实与历史脉络", category: "现状", whyExplore: "建立当前基本事实与历史脉络，作为探索的起点。", keywords: ["现状", "背景", "历史"], status: "not_started" },
    { title: "主要争议", description: "围绕该话题的不同立场与关键分歧", category: "争议", whyExplore: "了解不同立场与关键分歧，避免只看到单一观点。", keywords: ["争议", "立场", "分歧"], status: "not_started" },
    { title: "数据与统计", description: "可量化的数据、指标与统计口径", category: "数据", whyExplore: "寻找可量化的数据与统计口径，用证据支撑判断。", keywords: ["数据", "统计", "指标"], status: "not_started" },
    { title: "政策与制度", description: "相关政策、法律与制度安排", category: "政策", whyExplore: "了解相关政策、法律与制度安排，把握约束条件。", keywords: ["政策", "法规", "制度"], status: "insufficient_evidence" },
    { title: "多方观点", description: "不同群体、专家、亲历者的视角", category: "观点", whyExplore: "汇集不同群体、专家与亲历者的视角，补全信息面。", keywords: ["观点", "视角", "利益相关方"], status: "not_started" },
  ],
  duplicates: [
    { title: "部分背景介绍被多篇来源重复转述", reason: "二手转述较多，需回溯原始来源" },
    { title: "个别统计数字在不同材料中反复出现", reason: "同源数据被多次引用" },
  ],
  openQuestions: [
    "该话题缺乏统一的概念界定与测量标准",
    "关键结论的因果证据尚不充分",
    "部分主张缺少可核验的原始来源",
  ],
};

function topicConfig(topic: string): TopicConfig {
  return TOPIC_CONFIGS[topic] ?? GENERIC_CONFIG;
}

// 演示用「建议检索的问题」：由方向标题与关键词生成，仅作占位，非真实检索式。
function buildSearchQuestions(topic: string, title: string, keywords: string[]): string[] {
  const questions = [
    `${topic}「${title}」有哪些权威或一手来源？`,
    `${topic} 的「${title}」目前存在哪些不同观点？`,
  ];
  if (keywords[0]) {
    questions.push(`${topic} 与「${keywords[0]}」之间有什么关系？`);
  }
  return questions;
}

export function buildMockTopicMap(topic: string, goal: ExploreGoal): TopicMap {
  const cfg = topicConfig(topic);
  const dimensions: Dimension[] = cfg.dimensions.map((d, i) => ({
    id: `d${i + 1}`,
    title: d.title,
    description: d.description,
    category: d.category,
    whyExplore: d.whyExplore,
    searchQuestions: buildSearchQuestions(topic, d.title, d.keywords),
    keywords: d.keywords,
    status: d.status,
    priority: i + 1,
  }));
  return {
    topic,
    goal,
    generatedBy: "mock",
    mock: true,
    dimensions,
    suggestedNext: ["d1", "d2"],
    disclaimer:
      "本页为演示用模拟数据：方向、证据与来源链接均为虚构占位，不代表真实文献或事实；接入后端后将被真实检索结果替换。",
  };
}

interface EvidenceTemplate {
  title: (t: string) => string;
  summary: (t: string) => string;
  evidenceType: EvidenceType;
  sourceName: string;
  publishedAt: string;
  applicability: string;
  limitations: string;
  verificationNote: string;
}

const EVIDENCE_TEMPLATES: EvidenceTemplate[] = [
  {
    title: (t) => `${t}研究综述：概念、测量与争议`,
    summary: (t) => `系统梳理${t}相关研究中的概念界定、主流测量方法，以及学界对其成因与后果的主要争论。`,
    evidenceType: "academic",
    sourceName: "示例学术期刊 · 信息行为研究（模拟）",
    publishedAt: "2023",
    applicability: "适合建立概念框架、了解研究脉络与争议焦点。",
    limitations: "综述结论依赖所纳入原始研究的质量；部分测量方法尚未统一，结论具有概括性。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `关于${t}影响因素的实证研究`,
    summary: (t) => `基于问卷与行为数据，检验若干可能影响${t}形成的变量及其效应量。`,
    evidenceType: "academic",
    sourceName: "示例研究机构（模拟）",
    publishedAt: "2022",
    applicability: "适合了解变量间的相关关系与效应大小；可迁移性取决于样本情境。",
    limitations: "相关关系不等于因果；样本与情境有限，结论需在更大人群中重复验证。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `${t}的作用机制研究`,
    summary: (t) => `聚焦${t}背后的机制路径，提出并检验若干解释模型。`,
    evidenceType: "academic",
    sourceName: "示例会议论文（模拟）",
    publishedAt: "2024",
    applicability: "适合理解“为什么会发生”的机制解释。",
    limitations: "机制解释基于特定模型，可能遗漏替代解释；多为实验室或单场景结论。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `${t}相关统计数据汇编`,
    summary: (t) => `汇总若干公开统计口径下与${t}相关的分布与变化趋势。`,
    evidenceType: "data",
    sourceName: "示例数据平台（模拟）",
    publishedAt: "2023",
    applicability: "适合建立数量直觉、识别趋势；使用时需核对口径。",
    limitations: "统计口径与抽样方式影响可比性；不同来源数据可能无法直接合并。",
    verificationNote: "模拟数据，未核验",
  },
  {
    title: (t) => `行业机构关于${t}的专题报告`,
    summary: (t) => `从行业视角总结${t}的现状、风险与应对建议。`,
    evidenceType: "report",
    sourceName: "示例行业机构（模拟）",
    publishedAt: "2023",
    applicability: "适合了解行业共识与行动方向。",
    limitations: "报告可能受机构立场或资助方影响，建议交叉验证。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `媒体报道：${t}的近期案例与讨论`,
    summary: (t) => `梳理近期媒体对${t}的代表性报道与公众讨论热点。`,
    evidenceType: "news",
    sourceName: "示例新闻媒体（模拟）",
    publishedAt: "2024",
    applicability: "适合了解公众关注点与典型叙事。",
    limitations: "媒体叙事存在选择与简化，可能放大个别案例；不宜作为事实唯一依据。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `与${t}相关的官方文件或规范`,
    summary: (t) => `整理与${t}相关的官方文件、规范或政策表述。`,
    evidenceType: "official",
    sourceName: "示例官方机构（模拟）",
    publishedAt: "2023",
    applicability: "适合了解制度与规范层面的权威表述。",
    limitations: "文件表述较为原则化，具体执行与影响需另查实证材料。",
    verificationNote: "模拟来源，未核验",
  },
  {
    title: (t) => `专家评论：对${t}的多元视角`,
    summary: (t) => `汇集不同立场专家对${t}的判断与分歧。`,
    evidenceType: "commentary",
    sourceName: "示例评论平台（模拟）",
    publishedAt: "2024",
    applicability: "适合了解不同立场与价值分歧。",
    limitations: "观点性内容不代表事实，需与证据来源对照使用。",
    verificationNote: "模拟来源，未核验",
  },
];

function toCard(topic: string, dimensionId: string, k: number, tpl: EvidenceTemplate): EvidenceCard {
  return {
    id: `${dimensionId}-e${k + 1}`,
    dimensionId,
    title: tpl.title(topic),
    summary: tpl.summary(topic),
    sourceName: tpl.sourceName,
    sourceUrl: `https://example.com/${dimensionId}/source-${k + 1}`,
    evidenceType: tpl.evidenceType,
    publishedAt: tpl.publishedAt,
    applicability: tpl.applicability,
    limitations: tpl.limitations,
    verified: false,
    verificationNote: tpl.verificationNote,
  };
}

const POOL_SIZE = 5;

export function getMockEvidence(
  topic: string,
  dimensionId: string,
  offset: number,
  limit = 3
): EvidenceCard[] {
  const cfg = topicConfig(topic);
  const idx = parseInt(dimensionId.slice(1), 10) - 1; // "d1" -> 0
  const dim = cfg.dimensions[idx];

  // 证据不足的维度：只给出 1 条观点性材料，用于演示“证据不足”状态
  if (dim?.status === "insufficient_evidence") {
    if (offset > 0) return [];
    return [toCard(topic, dimensionId, 0, EVIDENCE_TEMPLATES[7])];
  }

  const result: EvidenceCard[] = [];
  const end = Math.min(offset + limit, POOL_SIZE);
  for (let k = offset; k < end; k++) {
    const tpl = EVIDENCE_TEMPLATES[(idx * 2 + k) % EVIDENCE_TEMPLATES.length];
    result.push(toCard(topic, dimensionId, k, tpl));
  }
  return result;
}

// 演示资料（SourceDocument）：全部为虚构占位，isMock 均为 true。
// 为演示边界状态，每组资料刻意包含：缺发布日期（k=1）、缺摘要且无链接（k=2）；
// 证据不足的方向返回空数组，用于演示“空结果”。
export function getMockSources(topic: string, directionId: string): SourceDocument[] {
  const cfg = topicConfig(topic);
  const idx = parseInt(directionId.slice(1), 10) - 1;
  const dim = cfg.dimensions[idx];

  if (dim?.status === "insufficient_evidence") return [];

  const docs: SourceDocument[] = [];
  for (let k = 0; k < 3; k++) {
    const tpl = EVIDENCE_TEMPLATES[(idx * 2 + k) % EVIDENCE_TEMPLATES.length];
    docs.push({
      id: `${directionId}-s${k + 1}`,
      title: tpl.title(topic),
      url: k === 2 ? "" : `https://example.com/${directionId}/source-${k + 1}`,
      sourceName: tpl.sourceName,
      publishedAt: k === 1 ? null : tpl.publishedAt,
      snippet: k === 2 ? "" : tpl.summary(topic),
      sourceType: tpl.evidenceType,
      retrievedAt: new Date().toISOString(),
      isMock: true,
    });
  }
  return docs;
}

export function getMockReportExtras(topic: string): {
  possibleDuplicates: DuplicateGroup[];
  openQuestions: string[];
} {
  const cfg = topicConfig(topic);
  return { possibleDuplicates: cfg.duplicates, openQuestions: cfg.openQuestions };
}
