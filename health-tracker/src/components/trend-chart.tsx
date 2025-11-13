'use client';

import { format } from "date-fns";

type TrendPoint = {
  date: string;
  value: number;
};

type TrendChartProps = {
  title: string;
  data: TrendPoint[];
  unit?: string;
};

const HEIGHT = 140;
const WIDTH = 460;
const PADDING = 24;

export function TrendChart({ title, data, unit }: TrendChartProps) {
  if (!data.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        <h3 className="text-left text-base font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mt-4 text-sm text-slate-500">
          Add entries to see your trend.
        </p>
      </section>
    );
  }

  const values = data.map((item) => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const sortedData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14);

  const coordinates = sortedData.map((item, index) => {
    const x =
      PADDING +
      (index / Math.max(sortedData.length - 1, 1)) * (WIDTH - PADDING * 2);
    const valueOffset = (item.value - minValue) / valueRange;
    const y = HEIGHT - PADDING - valueOffset * (HEIGHT - PADDING * 2);
    return { x, y, label: item.value };
  });

  const pathD = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`)
    .join(" ");
  const fillD = `${pathD} L ${PADDING + (WIDTH - PADDING * 2)} ${
    HEIGHT - PADDING
  } L ${PADDING} ${HEIGHT - PADDING} Z`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`${title} trend`}
        className="mt-6 w-full"
      >
        <defs>
          <linearGradient
            id="trend-fill"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          fill="transparent"
          rx={24}
        />
        <path
          d={fillD}
          fill="url(#trend-fill)"
          className="transition-all duration-300 ease-in-out"
        />
        <path
          d={pathD}
          fill="none"
          stroke="rgb(16, 185, 129)"
          strokeWidth={3}
          strokeLinecap="round"
          className="drop-shadow-[0_8px_16px_rgba(16,185,129,0.12)]"
        />
        {coordinates.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill="#fff"
              stroke="rgb(16, 185, 129)"
              strokeWidth={2}
            />
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              className="text-xs font-medium fill-slate-500"
            >
              {unit ? `${point.label}${unit}` : point.label}
            </text>
            <text
              x={point.x}
              y={HEIGHT - 4}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-400"
            >
              {format(new Date(sortedData[index].date), "MM/dd")}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
