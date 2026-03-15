"use client";

import { tokens } from "@/tokens";
import type { Provider } from "@/types/cloud";

interface ProviderGridProps {
  providers: Provider[];
  onSelect: (provider: Provider) => void;
}

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function ProviderGrid({ providers, onSelect }: ProviderGridProps) {
  return (
    <section aria-labelledby="providers-heading">
      <header style={{ marginBottom: 40 }}>
        <h1
          id="providers-heading"
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800,
            color: tokens.colors.textPrimary,
            letterSpacing: "-0.025em",
            marginBottom: 10,
            lineHeight: 1.1,
          }}
        >
          Cloud Infrastructure
        </h1>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 15 }}>
          Select a provider to inspect clusters and resource allocation.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))",
          gap: 16,
        }}
      >
        {providers.map((provider, i) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */

interface CardProps {
  provider: Provider;
  index: number;
  onSelect: (p: Provider) => void;
}

const staggerDelay = ["0s", "0.05s", "0.10s", "0.15s"];

function ProviderCard({ provider, index, onSelect }: CardProps) {
  const { color, rgb } = provider;

  return (
    <article
      className="anim-up"
      style={{ animationDelay: staggerDelay[index] ?? "0.2s" }}
      onClick={() => onSelect(provider)}
      role="button"
      tabIndex={0}
      aria-label={`${provider.name}, ${provider.totalCount} clusters, ${fmt(provider.totalCost)} monthly`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(provider)}
    >
      {/* Outer glow wrapper */}
      <div
        className="provider-card"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Corner accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgb},0.14) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Provider icon + badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: `rgba(${rgb},0.12)`,
              border: `1px solid rgba(${rgb},0.22)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {provider.icon}
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color,
              background: `rgba(${rgb},0.1)`,
              border: `1px solid rgba(${rgb},0.22)`,
              padding: "3px 10px",
              borderRadius: 20,
              letterSpacing: "0.05em",
            }}
          >
            {provider.shortName}
          </span>
        </div>

        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: tokens.colors.textPrimary,
            marginBottom: 18,
          }}
        >
          {provider.name}
        </h2>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[
            { label: "Clusters",   value: provider.totalCount },
            { label: "Active",     value: provider.activeCount },
            { label: "Avg Eff.",   value: `${provider.avgEfficiency}%` },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: tokens.font.mono,
                  color: tokens.colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: tokens.colors.textMuted,
                  letterSpacing: "0.03em",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Cost strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            background: tokens.colors.bg1,
            borderRadius: tokens.radius.sm,
          }}
        >
          <span style={{ fontSize: 12, color: tokens.colors.textMuted }}>
            Monthly cost
          </span>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              fontFamily: tokens.font.mono,
              color: tokens.colors.textPrimary,
            }}
          >
            {fmt(provider.totalCost)}
          </span>
        </div>

        {/* Chevron */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 14,
            right: 18,
            color: tokens.colors.textMuted,
            fontSize: 18,
            transition: "transform 0.2s, color 0.2s",
          }}
          className="card-chevron"
        >
          →
        </span>
      </div>
    </article>
  );
}
