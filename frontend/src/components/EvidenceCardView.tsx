import { useState } from "react";
import type { EvidenceCard } from "../types";
import EvidenceTypeBadge from "./EvidenceTypeBadge";

interface Props {
  card: EvidenceCard;
  onDigDeeper: () => void;
  onViewDifferent: () => void;
}

export default function EvidenceCardView({ card, onDigDeeper, onViewDifferent }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{card.title}</h3>
        <EvidenceTypeBadge type={card.evidenceType} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
        <span>来源：{card.sourceName}</span>
        {card.publishedAt && <span>{card.publishedAt}</span>}
        {card.sourceUrl && (
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            原始链接 ↗
          </a>
        )}
      </div>

      {card.verificationNote && (
        <p className="mt-3 rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          {card.verificationNote}
        </p>
      )}

      {expanded && (
        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p>
            <span className="font-medium">适用条件：</span>
            {card.applicability}
          </p>
          <p>
            <span className="font-medium">研究局限 / 不确定性：</span>
            {card.limitations}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          {expanded ? "收起适用条件" : "了解适用条件"}
        </button>
        <button
          onClick={onDigDeeper}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100"
        >
          继续深入
        </button>
        <button
          onClick={onViewDifferent}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          查看不同证据
        </button>
      </div>
    </article>
  );
}
