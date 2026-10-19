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

  const isEmpty = topicMap.dimensions.length === 0;

  function goToDirection(id: string) {
    navigate(`/direction/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{topicMap.topic}</h1>
          <p className="mt-1 text-sm text-slate-500">探索目标：{GOAL_LABELS[topicMap.goal]}</p>
        </div>
        <div className="text-sm text-slate-500">{topicMap.dimensions.length} 个探索方向</div>
      </div>

      {topicMap.mock && <MockBanner />}

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          该话题暂无探索方向，请返回首页换个话题。
        </div>
      ) : (
        <>
          <section className="hidden rounded-2xl border border-slate-200 bg-white p-4 md:block">
            <h2 className="sr-only">主题地图可视化</h2>
            <TopicMapVisual
              topic={topicMap.topic}
              dimensions={topicMap.dimensions}
              activeId={null}
              onSelect={goToDirection}
            />
            <p className="mt-2 text-center text-xs text-slate-400">
              点击节点或卡片进入方向详情 · 灰色=待探索 · 黄色=证据不足
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-slate-500">探索方向 · 点击查看详情</h2>
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
