import { EVIDENCE_TYPE_LABELS } from "../labels";
import type { EvidenceType } from "../types";

export default function EvidenceTypeBadge({ type }: { type: EvidenceType }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-brand-200/70 bg-brand-50/80 px-2.5 py-0.5 text-xs font-medium text-brand-700">
      {EVIDENCE_TYPE_LABELS[type]}
    </span>
  );
}
