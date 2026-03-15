"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/tokens";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: tokens.colors.bg2,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: 20,
        padding: "6px 14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 13,
        color: tokens.colors.textSecondary,
        fontFamily: tokens.font.sans,
        transition: "all 0.2s",
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
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}
