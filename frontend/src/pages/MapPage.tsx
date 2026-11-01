import { useNavigate } from "react-router-dom";
import DimensionCard from "../components/DimensionCard";
import MockBanner from "../components/MockBanner";
import TopicMapVisual from "../components/TopicMapVisual";
import { GOAL_LABELS } from "../labels";
import { useApp } from "../store";

export default function MapPage() {
  const navigate = useNavigate();
  const { topicMap } = useApp();

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

  const isEmpty = topicMap.dimensions.length === 0;

  function goToDirection(id: string) {
    navigate(`/direction/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-title">{topicMap.topic}</h1>
          <p className="mt-1 text-sm text-ink-muted">探索目标：{GOAL_LABELS[topicMap.goal]}</p>
        </div>
        <div className="text-sm text-ink-muted">{topicMap.dimensions.length} 个探索方向</div>
      </div>

      {topicMap.mock && <MockBanner />}

      {isEmpty ? (
        <div className="glass rounded-card p-12 text-center text-ink-muted">
          该话题暂无探索方向，请返回首页换个话题。
        </div>
      ) : (
        <>
          <section className="glass hidden rounded-card p-4 md:block">
            <h2 className="sr-only">主题地图可视化</h2>
            <TopicMapVisual
              topic={topicMap.topic}
              dimensions={topicMap.dimensions}
              activeId={null}
              onSelect={goToDirection}
            />
            <p className="mt-2 text-center text-xs text-ink-muted">
              点击节点或卡片进入方向详情 · 灰色=待探索 · 黄色=证据不足
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-ink-muted">探索方向 · 点击查看详情</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topicMap.dimensions.map((d) => (
                <DimensionCard
                  key={d.id}
                  dimension={d}
                  active={false}
                  onSelect={goToDirection}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
