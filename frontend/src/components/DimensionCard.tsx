import type { Dimension } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  dimension: Dimension;
  active: boolean;
  onSelect: (id: string) => void;
}

export default function DimensionCard({ dimension, active, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(dimension.id)}
      className={`glass w-full rounded-card p-4 text-left transition ${
        active
          ? "ring-2 ring-brand-300/70"
          : "hover:-translate-y-0.5 hover:shadow-card-hover"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-ink-title">{dimension.title}</h3>
        <StatusBadge status={dimension.status} />
      </div>
      <span className="mt-1.5 inline-block rounded bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
        {dimension.category}
      </span>
      <p className="mt-2 text-sm leading-relaxed text-ink-body">{dimension.description}</p>
      <p className="mt-2 text-sm text-ink-muted">
        <span className="font-medium text-ink-body">为什么探索：</span>
        {dimension.whyExplore}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {dimension.keywords.map((k) => (
          <span key={k} className="rounded bg-white/70 px-2 py-0.5 text-xs text-ink-muted">
            {k}
          </span>
        ))}
      </div>
    </button>
  );
}
