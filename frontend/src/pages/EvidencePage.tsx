import { useNavigate } from "react-router-dom";
import EvidenceCardView from "../components/EvidenceCardView";
import MockBanner from "../components/MockBanner";
import { ArrowRightIcon } from "../components/Icon";
import { useApp } from "../store";

export default function EvidencePage() {
  const navigate = useNavigate();
  const {
    topicMap,
    activeDimensionId,
    evidenceByDimension,
    selectDimension,
    loadMoreEvidence,
    loadingEvidence,
  } = useApp();

  if (!topicMap) {
    return (
      <div className="py-24 text-center">
        <p className="text-ink-muted">尚未开始探索。</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-brand-600 px-4 py-2 text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
        >
          去首页开始
        </button>
      </div>
    );
  }

  const activeDim = topicMap.dimensions.find((d) => d.id === activeDimensionId) ?? null;
  const cards = activeDimensionId ? evidenceByDimension[activeDimensionId] ?? [] : [];
  const insufficient = activeDim?.status === "insufficient_evidence";

  async function handleSwitch(id: string) {
    await selectDimension(id);
  }

  async function handleViewDifferent() {
    if (!activeDimensionId) return;
    const idx = topicMap!.dimensions.findIndex((d) => d.id === activeDimensionId);
    const next = topicMap!.dimensions[(idx + 1) % topicMap!.dimensions.length];
    await handleSwitch(next.id);
  }

  async function handleDigDeeper() {
    if (activeDimensionId) await loadMoreEvidence(activeDimensionId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/map")}
            className="text-sm text-ink-muted transition hover:text-brand-700"
          >
            ← 返回探索地图
          </button>
          <h1 className="mt-1 text-2xl font-bold text-ink-title">
            {activeDim ? activeDim.title : "证据探索"}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">主题：{topicMap.topic}</p>
        </div>
      </div>

      {topicMap.mock && <MockBanner />}

      {/* 维度切换 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {topicMap.dimensions.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSwitch(d.id)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${
              d.id === activeDimensionId
                ? "border-brand-500 bg-brand-600 text-white shadow-button"
                : "border-white/70 bg-white/70 text-ink-body backdrop-blur hover:border-brand-300 hover:bg-white"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {insufficient && (
        <div className="rounded-control border border-amber-300/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-800 backdrop-blur">
          该维度目前<b>证据不足</b>：仅有观点性材料，缺少可核验的原始证据。建议把它标记为“待核实问题”，而不是当作结论。
        </div>
      )}

      {loadingEvidence && cards.length === 0 ? (
        <p className="py-12 text-center text-ink-muted">正在加载证据…</p>
      ) : cards.length === 0 ? (
        <p className="py-12 text-center text-ink-muted">该维度暂无更多证据。</p>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <EvidenceCardView
              key={card.id}
              card={card}
              onDigDeeper={handleDigDeeper}
              onViewDifferent={handleViewDifferent}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/map")}
          className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-ink-body shadow-sm backdrop-blur transition hover:border-brand-200 hover:bg-white active:scale-[0.98]"
        >
          返回地图
        </button>
        {cards.length > 0 && (
          <button
            onClick={handleDigDeeper}
            disabled={loadingEvidence}
            className="rounded-full border border-brand-200/70 bg-brand-50/80 px-4 py-2 text-sm text-brand-700 backdrop-blur transition hover:bg-brand-100 active:scale-[0.98] disabled:opacity-50"
          >
            {loadingEvidence ? "加载中…" : "继续深入本维度"}
          </button>
        )}
        <button
          onClick={() => navigate("/report")}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
        >
          查看探索报告 <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
