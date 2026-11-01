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
    <article className="glass rounded-card p-5 transition hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug text-ink-title">{card.title}</h3>
        <EvidenceTypeBadge type={card.evidenceType} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-body">{card.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
        <span>来源：{card.sourceName}</span>
        {card.publishedAt && <span>{card.publishedAt}</span>}
        {card.sourceUrl && (
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:text-brand-800 hover:underline"
          >
            原始链接 ↗
          </a>
        )}
      </div>

      {card.verificationNote && (
        <p className="mt-3 rounded-control border border-amber-200/70 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-700">
          {card.verificationNote}
        </p>
      )}

      {expanded && (
        <div className="mt-3 space-y-2 rounded-control bg-white/60 p-4 text-sm text-ink-body">
          <p>
            <span className="font-medium text-ink-title">适用条件：</span>
            {card.applicability}
          </p>
          <p>
            <span className="font-medium text-ink-title">研究局限 / 不确定性：</span>
            {card.limitations}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm text-ink-body shadow-sm backdrop-blur transition hover:bg-white active:scale-[0.98]"
        >
          {expanded ? "收起适用条件" : "了解适用条件"}
        </button>
        <button
          onClick={onDigDeeper}
          className="rounded-full bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
        >
          继续深入
        </button>
        <button
          onClick={onViewDifferent}
          className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm text-ink-body shadow-sm backdrop-blur transition hover:bg-white active:scale-[0.98]"
        >
          查看不同证据
        </button>
      </div>
    </article>
  );
}
