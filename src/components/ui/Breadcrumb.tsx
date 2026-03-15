"use client";

import { tokens } from "@/tokens";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ color: tokens.colors.textMuted, fontSize: 14 }}
              >
                ›
              </span>
            )}

            {item.onClick ? (
              <button
                onClick={item.onClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: tokens.colors.textSecondary,
                  fontSize: 13,
                  fontFamily: tokens.font.sans,
                  padding: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    tokens.colors.textPrimary)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    tokens.colors.textSecondary)
                }
              >
                {item.label}
              </button>
            ) : (
              <span
                aria-current="page"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: tokens.colors.accentGreen,
                  background: tokens.colors.accentGreen10,
                  border: `1px solid ${tokens.colors.accentGreen20}`,
                  padding: "3px 12px",
                  borderRadius: 20,
                }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
