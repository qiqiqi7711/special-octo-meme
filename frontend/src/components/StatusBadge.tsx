import { STATUS_META } from "../labels";
import type { DimensionStatus } from "../types";

export default function StatusBadge({ status }: { status: DimensionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {meta.label}
    </span>
  );
}
