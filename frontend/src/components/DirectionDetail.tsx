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
        className="text-sm text-ink-muted transition hover:text-brand-700"
      >
        ← 返回方向列表
      </button>

      <div className="glass rounded-card p-6">
        <p className="text-xs text-ink-muted">初始话题：{topic}</p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink-title">{dimension.title}</h1>
          <StatusBadge status={dimension.status} />
        </div>

        <span className="mt-3 inline-block rounded bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {dimension.category}
        </span>

        <section className="mt-5">
          <h2 className="text-sm font-medium text-ink-muted">方向说明</h2>
          <p className="mt-1 leading-relaxed text-ink-body">{dimension.description}</p>
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-medium text-ink-muted">为什么值得探索</h2>
          <p className="mt-1 leading-relaxed text-ink-body">{dimension.whyExplore}</p>
        </section>

        {dimension.searchQuestions.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-medium text-ink-muted">建议检索的问题</h2>
            <ul className="mt-2 space-y-1.5">
              {dimension.searchQuestions.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-body">
                  <span className="mt-0.5 text-brand-500">·</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {dimension.keywords.length > 0 && (
          <section className="mt-5">
            <h2 className="text-sm font-medium text-ink-muted">相关关键词</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {dimension.keywords.map((k) => (
                <span key={k} className="rounded bg-white/70 px-2.5 py-1 text-xs text-ink-body">
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <button
        onClick={onBack}
        className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-ink-body shadow-sm backdrop-blur transition hover:border-brand-200 hover:bg-white active:scale-[0.98]"
      >
        返回方向列表
      </button>
    </div>
  );
}
