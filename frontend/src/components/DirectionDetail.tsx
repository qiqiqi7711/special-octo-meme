import type { Dimension } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  topic: string;
  dimension: Dimension;
  onBack: () => void;
}

export default function DirectionDetail({ topic, dimension, onBack }: Props) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 transition hover:text-slate-700"
      >
        ← 返回方向列表
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs text-slate-400">初始话题：{topic}</p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{dimension.title}</h1>
          <StatusBadge status={dimension.status} />
        </div>

        <span className="mt-3 inline-block rounded bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
          {dimension.category}
        </span>

        <section className="mt-5">
          <h2 className="text-sm font-medium text-slate-500">方向说明</h2>
          <p className="mt-1 text-slate-700">{dimension.description}</p>
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-medium text-slate-500">为什么值得探索</h2>
          <p className="mt-1 text-slate-700">{dimension.whyExplore}</p>
        </section>

        {dimension.searchQuestions.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-medium text-slate-500">建议检索的问题</h2>
            <ul className="mt-2 space-y-1.5">
              {dimension.searchQuestions.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-indigo-500">·</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {dimension.keywords.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-medium text-slate-500">相关关键词</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {dimension.keywords.map((k) => (
                <span key={k} className="rounded bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <button
        onClick={onBack}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        返回方向列表
      </button>
    </div>
  );
}
