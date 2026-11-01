import type { Dimension, DimensionStatus } from "../types";

interface Props {
  topic: string;
  dimensions: Dimension[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const NODE_COLORS: Record<DimensionStatus, { fill: string; stroke: string; text: string }> = {
  not_started: { fill: "#f3f1fb", stroke: "#b9b4e6", text: "#4b4682" },
  explored: { fill: "#d9f6e6", stroke: "#34c28c", text: "#0a6b49" },
  insufficient_evidence: { fill: "#fdf0d5", stroke: "#f0a132", text: "#8a5a10" },
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
      <defs>
        <radialGradient id="topicMapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5d56cb" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#5d56cb" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={190} fill="url(#topicMapGlow)" />

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
            stroke="#d8d2f0"
            strokeWidth={1.5}
          />
        );
      })}

      <circle cx={cx} cy={cy} r={54} fill="#5d56cb" />
      <circle cx={cx} cy={cy} r={54} fill="none" stroke="#766fe4" strokeOpacity="0.4" strokeWidth={6} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#ffffff" fontSize={16} fontWeight={600}>
        {centerLabel}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#d7d0f5" fontSize={12}>
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
            className="cursor-pointer transition-opacity hover:opacity-80"
            role="button"
            tabIndex={0}
          >
            <circle
              cx={nx}
              cy={ny}
              r={26}
              fill={colors.fill}
              stroke={active ? "#5d56cb" : colors.stroke}
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
              fill={active ? "#5d56cb" : "#37345f"}
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
