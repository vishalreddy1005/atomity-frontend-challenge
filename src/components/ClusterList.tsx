"use client";

import { useState } from "react";
import { tokens } from "@/tokens";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BarChart } from "@/components/ui/BarChart";
import { Badge } from "@/components/ui/Badge";
import type { Cluster, Provider } from "@/types/cloud";

interface ClusterListProps {
  provider: Provider;
  onBack: () => void;
  onSelectCluster: (cluster: Cluster) => void;
}

const COLS = ["CPU", "RAM", "Storage", "Network", "GPU", "Efficiency", "Total"];
const fmt  = (n: number) => `$${n.toLocaleString()}`;

export function ClusterList({ provider, onBack, onSelectCluster }: ClusterListProps) {
  const [hoveredBar, setHoveredBar] = useState<number | undefined>();

  return (
    <section className="anim-sl" aria-labelledby="clusters-heading">
      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
        <BackButton onClick={onBack} label="Back to providers" />
        <Breadcrumb
          items={[
            { label: "All Providers", onClick: onBack },
            { label: `${provider.name} — Clusters` },
          ]}
        />
      </div>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2
            id="clusters-heading"
            style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: 4 }}
          >
            {provider.totalCount} Clusters
          </h2>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14 }}>
            {provider.activeCount} active · {provider.totalCount - provider.activeCount} inactive
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: tokens.colors.textMuted, marginBottom: 2 }}>Total monthly</p>
          <p style={{ fontSize: 26, fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.colors.accentGreen }}>
            {fmt(provider.totalCost)}
          </p>
        </div>
      </div>

      {/* Bar chart card */}
      <div
        style={{
          background: tokens.colors.bg2,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.lg,
          padding: "20px 20px 10px",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: tokens.colors.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Cost by Cluster
          </span>
          <span
            style={{
              fontSize: 11,
              color: tokens.colors.accentGreen,
              background: tokens.colors.accentGreen10,
              border: `1px solid ${tokens.colors.accentGreen20}`,
              padding: "2px 10px",
              borderRadius: 20,
            }}
          >
            Last 30 Days
          </span>
        </div>
        <BarChart
          clusters={provider.clusters}
          selectedId={hoveredBar}
          onSelect={(c) => { setHoveredBar(c.id); onSelectCluster(c); }}
        />
      </div>

      {/* Data table */}
      <div
        style={{
          background: tokens.colors.bg2,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.lg,
          overflow: "hidden",
        }}
      >
        {/* Table head */}
        <div
          role="rowgroup"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px,1fr) repeat(7, minmax(72px, 1fr))",
            padding: "12px 20px",
            background: tokens.colors.bg1,
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          <span style={thStyle}>Cluster</span>
          {COLS.map((c) => <span key={c} style={{ ...thStyle, textAlign: "right" }}>{c}</span>)}
        </div>

        {/* Rows */}
        {provider.clusters.map((cluster, i) => (
          <ClusterRow
            key={cluster.id}
            cluster={cluster}
            index={i}
            total={provider.clusters.length}
            onSelect={onSelectCluster}
          />
        ))}
      </div>
    </section>
  );
}

/* ── sub-components ─────────────────────────────────────────────── */

function ClusterRow({ cluster, index, total, onSelect }: {
  cluster: Cluster;
  index: number;
  total: number;
  onSelect: (c: Cluster) => void;
}) {
  const effColor =
    cluster.efficiency >= 40
      ? tokens.colors.accentGreen
      : cluster.efficiency >= 20
      ? tokens.colors.accentAmber
      : tokens.colors.accentRed;

  return (
    <div
      className={`anim-up d${Math.min(index + 1, 4)}`}
      role="row"
      tabIndex={0}
      aria-label={`${cluster.name}, ${cluster.active ? "active" : "inactive"}, total ${fmt(cluster.total)}`}
      onClick={() => onSelect(cluster)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(cluster)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(120px,1fr) repeat(7, minmax(72px, 1fr))",
        padding: "14px 20px",
        borderBottom: index < total - 1 ? `1px solid ${tokens.colors.border}` : "none",
        cursor: "pointer",
        transition: "background 0.15s",
        alignItems: "center",
        outline: "none",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = tokens.colors.bgHover)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
      onFocus={(e) => ((e.currentTarget as HTMLElement).style.background = tokens.colors.bgHover)}
      onBlur={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* Name + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: tokens.colors.textPrimary }}>{cluster.name}</span>
        <Badge active={cluster.active} />
      </div>

      {/* Numeric cells */}
      {[cluster.cpu, cluster.ram, cluster.storage, cluster.network, cluster.gpu].map((val, vi) => (
        <span key={vi} style={numCellStyle}>{fmt(val)}</span>
      ))}

      {/* Efficiency */}
      <span style={{ ...numCellStyle, color: effColor, fontWeight: 600 }}>
        {cluster.efficiency}%
      </span>

      {/* Total */}
      <span style={{ ...numCellStyle, fontSize: 14, fontWeight: 700, color: tokens.colors.textPrimary }}>
        {fmt(cluster.total)}
      </span>
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: "none",
        border: `1px solid ${tokens.colors.border}`,
        color: tokens.colors.textSecondary,
        padding: "6px 14px",
        borderRadius: 20,
        cursor: "pointer",
        fontFamily: tokens.font.sans,
        fontSize: 13,
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = tokens.colors.borderGreen;
        (e.currentTarget as HTMLElement).style.color = tokens.colors.textPrimary;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = tokens.colors.border;
        (e.currentTarget as HTMLElement).style.color = tokens.colors.textSecondary;
      }}
    >
      ← Back
    </button>
  );
}

/* ── shared styles ──────────────────────────────────────────────── */
const thStyle: React.CSSProperties = {
  fontSize: 11,
  color: tokens.colors.textMuted,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const numCellStyle: React.CSSProperties = {
  textAlign: "right",
  fontSize: 13,
  fontFamily: tokens.font.mono,
  color: tokens.colors.textSecondary,
};
