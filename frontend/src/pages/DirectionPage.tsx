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

  const dimension = topicMap.dimensions.find((d) => d.id === id);

  if (!dimension) {
    return (
      <div className="py-24 text-center">
        <p className="text-ink-muted">未找到该探索方向。</p>
        <button
          onClick={() => navigate("/map")}
          className="mt-4 rounded-full bg-brand-600 px-4 py-2 text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
        >
          返回方向列表
        </button>
      </div>
    );
  }

  const topic = topicMap.topic;

  const handleViewMaterials = async () => {
    setShowMaterials(true);
    setLoadingSources(true);
    setError(null);
    try {
      const docs = await loadSources(topic, dimension);
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

      <section className="glass rounded-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-title">该方向资料</h2>
          {!showMaterials && (
            <button
              onClick={handleViewMaterials}
              className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
            >
              查看该方向资料
            </button>
          )}
        </div>

        {showMaterials && loadingSources && (
          <p className="mt-4 py-8 text-center text-ink-muted">正在加载资料…</p>
        )}

        {showMaterials && !loadingSources && error && (
          <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {showMaterials && !loadingSources && !error && sources.length === 0 && (
          <p className="mt-4 py-8 text-center text-ink-muted">该方向暂无资料。</p>
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
