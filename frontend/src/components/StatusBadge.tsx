import { STATUS_META } from "../labels";
import type { DimensionStatus } from "../types";

export default function StatusBadge({ status }: { status: DimensionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}
