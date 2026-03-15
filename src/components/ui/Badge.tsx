import { tokens } from "@/tokens";

interface BadgeProps {
  active: boolean;
}

export function Badge({ active }: BadgeProps) {
  return (
    <span
      aria-label={active ? "Active" : "Inactive"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        fontFamily: tokens.font.sans,
        background: active
          ? tokens.colors.accentGreen10
          : "rgba(255,255,255,0.05)",
        color: active ? tokens.colors.accentGreen : tokens.colors.textMuted,
        border: `1px solid ${
          active ? tokens.colors.accentGreen20 : "rgba(255,255,255,0.08)"
        }`,
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: active
            ? tokens.colors.accentGreen
            : tokens.colors.textMuted,
          ...(active
            ? { boxShadow: `0 0 6px ${tokens.colors.accentGreen}` }
            : {}),
        }}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
