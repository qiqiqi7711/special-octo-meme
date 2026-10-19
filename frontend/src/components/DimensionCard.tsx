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
      className={`w-full rounded-xl border bg-white p-4 text-left transition ${
        active
          ? "border-indigo-500 ring-2 ring-indigo-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{dimension.title}</h3>
        <StatusBadge status={dimension.status} />
      </div>
      <span className="mt-1 inline-block rounded bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
        {dimension.category}
      </span>
      <p className="mt-2 text-sm text-slate-600">{dimension.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        <span className="font-medium text-slate-600">为什么探索：</span>
        {dimension.whyExplore}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {dimension.keywords.map((k) => (
          <span key={k} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {k}
          </span>
        ))}
      </div>
    </button>
  );
}
