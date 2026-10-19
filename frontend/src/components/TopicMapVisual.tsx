import type { Dimension, DimensionStatus } from "../types";

interface Props {
  topic: string;
  dimensions: Dimension[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const NODE_COLORS: Record<DimensionStatus, { fill: string; stroke: string; text: string }> = {
  not_started: { fill: "#e2e8f0", stroke: "#94a3b8", text: "#334155" },
  explored: { fill: "#a7f3d0", stroke: "#10b981", text: "#065f46" },
  insufficient_evidence: { fill: "#fde68a", stroke: "#f59e0b", text: "#92400e" },
};

export default function TopicMapVisual({ topic, dimensions, activeId, onSelect }: Props) {
  const cx = 300;
  const cy = 200;
  const radius = 150;
  const centerLabel = topic.length > 6 ? `${topic.slice(0, 6)}…` : topic;

  return (
    <svg
      viewBox="0 0 600 400"
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label={`${topic} 主题探索地图`}
    >
      {dimensions.map((d, i) => {
        const angle = ((-90 + (360 / dimensions.length) * i) * Math.PI) / 180;
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);
        return (
          <line
            key={`line-${d.id}`}
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke="#cbd5e1"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        );
      })}

      <circle cx={cx} cy={cy} r={54} fill="#4f46e5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#ffffff" fontSize={16} fontWeight={600}>
        {centerLabel}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#c7d2fe" fontSize={12}>
        {dimensions.length} 个维度
      </text>

      {dimensions.map((d, i) => {
        const angle = ((-90 + (360 / dimensions.length) * i) * Math.PI) / 180;
        const nx = cx + radius * Math.cos(angle);
        const ny = cy + radius * Math.sin(angle);
        const colors = NODE_COLORS[d.status];
        const active = d.id === activeId;
        return (
          <g
            key={d.id}
            onClick={() => onSelect(d.id)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <circle
              cx={nx}
              cy={ny}
              r={26}
              fill={colors.fill}
              stroke={active ? "#4f46e5" : colors.stroke}
              strokeWidth={active ? 3 : 1.5}
            />
            <text
              x={nx}
              y={ny + 4}
              textAnchor="middle"
              fill={colors.text}
              fontSize={13}
              fontWeight={600}
            >
              {i + 1}
            </text>
            <text
              x={nx}
              y={ny + 44}
              textAnchor="middle"
              fill={active ? "#4f46e5" : "#334155"}
              fontSize={13}
              fontWeight={active ? 600 : 400}
            >
              {d.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
