"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/tokens";
import type { Cluster } from "@/types/cloud";

interface BarChartProps {
  clusters: Cluster[];
  selectedId?: number;
  onSelect?: (cluster: Cluster) => void;
}

const BAR_W  = 56;
const GAP    = 32;
const CHART_H = 130;

export function BarChart({ clusters, selectedId, onSelect }: BarChartProps) {
  const [animated, setAnimated] = useState(false);

  // Animate bars in after a short delay (simulates scroll-trigger on mount)
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, [clusters]);

  const maxVal = Math.max(...clusters.map((c) => c.total), 1);
  const svgW   = clusters.length * (BAR_W + GAP) + GAP;

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <svg
        width={svgW}
        height={CHART_H + 36}
        style={{ display: "block" }}
        aria-label="Cost per cluster bar chart"
        role="img"
      >
        {/* Dashed grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = CHART_H - ratio * CHART_H + 0.5;
          return (
            <line
              key={ratio}
              x1={0}
              x2={svgW}
              y1={y}
              y2={y}
              stroke={tokens.colors.border}
              strokeDasharray="4 4"
            />
          );
        })}

        {clusters.map((cluster, i) => {
          const pct      = cluster.total / maxVal;
          const barH     = animated ? pct * CHART_H : 0;
          const x        = i * (BAR_W + GAP) + GAP;
          const y        = CHART_H - barH;
          const selected = cluster.id === selectedId;

          return (
            <g
              key={cluster.id}
              onClick={() => onSelect?.(cluster)}
              tabIndex={0}
              role="button"
              aria-label={`${cluster.name}: $${cluster.total.toLocaleString()}`}
              onKeyDown={(e) => e.key === "Enter" && onSelect?.(cluster)}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={6}
                fill={
                  selected
                    ? tokens.colors.accentGreen
                    : tokens.colors.accentGreen20
                }
                style={{
                  transition:
                    "height 0.85s cubic-bezier(.16,1,.3,1), y 0.85s cubic-bezier(.16,1,.3,1), fill 0.2s",
                  transitionDelay: `${i * 0.07}s`,
                }}
              />

              {/* Cost label above bar (only if animated & tall enough) */}
              {animated && barH > 24 && (
                <text
                  x={x + BAR_W / 2}
                  y={y + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily={tokens.font.mono}
                  fill={selected ? tokens.colors.bg0 : tokens.colors.textMuted}
                  style={{ userSelect: "none" }}
                >
                  ${Math.round(cluster.total / 1000)}k
                </text>
              )}

              {/* Cluster label below */}
              <text
                x={x + BAR_W / 2}
                y={CHART_H + 20}
                textAnchor="middle"
                fontSize={11}
                fontFamily={tokens.font.sans}
                fontWeight={selected ? 700 : 500}
                fill={
                  selected
                    ? tokens.colors.accentGreen
                    : tokens.colors.textSecondary
                }
                style={{ userSelect: "none" }}
              >
                {cluster.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
