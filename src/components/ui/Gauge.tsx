"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/tokens";

interface GaugeProps {
  label: string;
  used: number;
  requested: number;
  color?: string;
  size?: number;
  unit?: string;
}

const RADIUS = 44;
const CIRC   = 2 * Math.PI * RADIUS; // ≈ 276.5

export function Gauge({
  label,
  used,
  requested,
  color = tokens.colors.accentGreen,
  size = 130,
  unit = "$",
}: GaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, [used, requested]);

  const pct    = requested > 0 ? Math.min(used / requested, 1) : 0;
  const offset = CIRC - CIRC * (animated ? pct : 0);

  const fmt = (n: number) =>
    unit === "$"
      ? `$${n.toLocaleString()}`
      : `${n.toLocaleString()} ${unit}`;

  return (
    <figure
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        margin: 0,
      }}
    >
      {/* Ring */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
          role="img"
          aria-label={`${label}: ${Math.round(pct * 100)}% used`}
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={tokens.colors.bg3}
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{
              transition:
                "stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1) 0.1s",
            }}
          />
        </svg>

        {/* Centre text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: tokens.font.mono,
              color: tokens.colors.textPrimary,
              lineHeight: 1,
            }}
          >
            {Math.round(pct * 100)}%
          </span>
          <span style={{ fontSize: 9, color: tokens.colors.textMuted }}>
            used
          </span>
        </div>
      </div>

      {/* Label */}
      <figcaption style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: tokens.colors.textSecondary,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {label}
        </p>

        {/* Used / Requested */}
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginTop: 6,
          }}
        >
          {[
            { key: "used", val: used, clr: color },
            { key: "req",  val: requested, clr: tokens.colors.textMuted },
          ].map(({ key, val, clr }) => (
            <span
              key={key}
              style={{
                fontSize: 11,
                fontFamily: tokens.font.mono,
                color: clr,
                background: tokens.colors.bg1,
                border: `1px solid ${tokens.colors.border}`,
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              {requested > 0 ? fmt(val) : "—"}
            </span>
          ))}
        </div>
        <p
          style={{
            fontSize: 9,
            color: tokens.colors.textMuted,
            marginTop: 2,
          }}
        >
          used · requested
        </p>
      </figcaption>
    </figure>
  );
}
