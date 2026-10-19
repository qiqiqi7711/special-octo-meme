import { useNavigate } from "react-router-dom";
import EvidenceCardView from "../components/EvidenceCardView";
import MockBanner from "../components/MockBanner";
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
        <p className="text-slate-500">尚未开始探索。</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
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
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← 返回探索地图
          </button>
          <h1 className="mt-1 text-2xl font-bold">
            {activeDim ? activeDim.title : "证据探索"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">主题：{topicMap.topic}</p>
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
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {insufficient && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          该维度目前<b>证据不足</b>：仅有观点性材料，缺少可核验的原始证据。建议把它标记为“待核实问题”，而不是当作结论。
        </div>
      )}

      {loadingEvidence && cards.length === 0 ? (
        <p className="py-12 text-center text-slate-400">正在加载证据…</p>
      ) : cards.length === 0 ? (
        <p className="py-12 text-center text-slate-400">该维度暂无更多证据。</p>
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
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          返回地图
        </button>
        {cards.length > 0 && (
          <button
            onClick={handleDigDeeper}
            disabled={loadingEvidence}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            {loadingEvidence ? "加载中…" : "继续深入本维度"}
          </button>
        )}
        <button
          onClick={() => navigate("/report")}
          className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          查看探索报告 →
        </button>
      </div>
    </div>
  );
}
