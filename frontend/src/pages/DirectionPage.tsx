import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DirectionDetail from "../components/DirectionDetail";
import SourceCard from "../components/SourceCard";
import { loadSources } from "../services/explorationService";
import { useApp } from "../store";
import type { SourceDocument } from "../types";

export default function DirectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { topicMap } = useApp();

  const [showMaterials, setShowMaterials] = useState(false);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const dimension = topicMap.dimensions.find((d) => d.id === id);

  if (!dimension) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500">未找到该探索方向。</p>
        <button
          onClick={() => navigate("/map")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          返回方向列表
        </button>
      </div>
    );
  }

  const topic = topicMap.topic;
  const directionId = dimension.id;

  async function handleViewMaterials() {
    setShowMaterials(true);
    setLoadingSources(true);
    setError(null);
    try {
      const docs = await loadSources(topic, directionId);
      setSources(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSources([]);
    } finally {
      setLoadingSources(false);
    }
  }

  return (
    <div className="space-y-6">
      <DirectionDetail
        topic={topic}
        dimension={dimension}
        onBack={() => navigate("/map")}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">该方向资料</h2>
          {!showMaterials && (
            <button
              onClick={handleViewMaterials}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              查看该方向资料
            </button>
          )}
        </div>

        {showMaterials && loadingSources && (
          <p className="mt-4 py-8 text-center text-slate-400">正在加载资料…</p>
        )}

        {showMaterials && !loadingSources && error && (
          <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {showMaterials && !loadingSources && !error && sources.length === 0 && (
          <p className="mt-4 py-8 text-center text-slate-400">该方向暂无资料。</p>
        )}

        {showMaterials && !loadingSources && !error && sources.length > 0 && (
          <div className="mt-4 space-y-4">
            {sources.map((s) => (
              <SourceCard key={s.id} doc={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
