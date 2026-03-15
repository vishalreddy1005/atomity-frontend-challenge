"use client";

import { useState, useReducer } from "react";
import { useCloudData } from "@/hooks/useCloudData";
import { ProviderGrid } from "@/components/ProviderGrid";
import { ClusterList } from "@/components/ClusterList";
import { ClusterDetail } from "@/components/ClusterDetail";
import { Skeleton } from "@/components/ui/Skeleton";
import { tokens } from "@/tokens";
import type { Cluster, DashboardState, Provider } from "@/types/cloud";

type Action =
  | { type: "SELECT_PROVIDER"; provider: Provider }
  | { type: "SELECT_CLUSTER"; cluster: Cluster }
  | { type: "BACK_TO_PROVIDERS" }
  | { type: "BACK_TO_CLUSTERS" };

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "SELECT_PROVIDER": return { view:"clusters", provider:action.provider, cluster:null };
    case "SELECT_CLUSTER":  return { ...state, view:"cluster", cluster:action.cluster };
    case "BACK_TO_PROVIDERS": return { view:"providers", provider:null, cluster:null };
    case "BACK_TO_CLUSTERS":  return { ...state, view:"clusters", cluster:null };
    default: return state;
  }
}

const initial: DashboardState = { view:"providers", provider:null, cluster:null };

export function Dashboard() {
  const { data:providers, isLoading, isError, error } = useCloudData();
  const [state, dispatch] = useReducer(reducer, initial);
  const [theme, setTheme] = useState<"dark"|"light">("dark");

  const toggleTheme = () => {
    const next = theme==="dark"?"light":"dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (isLoading) return <LoadingState />;

  if (isError || !providers) return (
    <div role="alert" style={{ padding:40, textAlign:"center", color:tokens.colors.accentRed, fontSize:14 }}>
      <p style={{ marginBottom:8 }}>⚠ Failed to load cloud data</p>
      <p style={{ color:tokens.colors.textMuted, fontSize:12 }}>{(error as Error)?.message ?? "Unknown error"}</p>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:tokens.colors.bg0, fontFamily:tokens.font.sans }}>
      <header style={{ position:"sticky", top:0, zIndex:50, background:tokens.colors.bg1, borderBottom:`1px solid ${tokens.colors.border}`, padding:"0 clamp(16px,4vw,48px)", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span aria-hidden="true" style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg, ${tokens.colors.accentGreen}, ${tokens.colors.accentBlue})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800 }}>A</span>
          <span style={{ fontWeight:800, fontSize:16, color:tokens.colors.textPrimary, letterSpacing:"-0.02em" }}>atomity</span>
          <span style={{ fontSize:10, color:tokens.colors.textMuted, background:tokens.colors.bg3, border:`1px solid ${tokens.colors.border}`, padding:"1px 7px", borderRadius:10, marginLeft:4 }}>Cloud</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, color:tokens.colors.textMuted }}>Last 30 Days</span>
          <button onClick={toggleTheme} aria-label={`Switch to ${theme==="dark"?"light":"dark"} mode`}
            style={{ background:tokens.colors.bg3, border:`1px solid ${tokens.colors.border}`, borderRadius:20, padding:"4px 12px", cursor:"pointer", fontSize:12, color:tokens.colors.textSecondary, fontFamily:tokens.font.sans }}>
            {theme==="dark"?"☀ Light":"☾ Dark"}
          </button>
        </div>
      </header>

      <main style={{ maxWidth:1200, margin:"0 auto", padding:"clamp(24px,4vw,52px) clamp(16px,4vw,40px)" }}>
        {state.view==="providers" && (
          <ProviderGrid providers={providers} onSelect={p => dispatch({ type:"SELECT_PROVIDER", provider:p })} />
        )}
        {state.view==="clusters" && state.provider && (
          <ClusterList provider={state.provider} onBack={()=>dispatch({type:"BACK_TO_PROVIDERS"})} onSelectCluster={c=>dispatch({type:"SELECT_CLUSTER",cluster:c})} />
        )}
        {state.view==="cluster" && state.provider && state.cluster && (
          <ClusterDetail provider={state.provider} cluster={state.cluster} onBack={()=>dispatch({type:"BACK_TO_CLUSTERS"})} onBackToProviders={()=>dispatch({type:"BACK_TO_PROVIDERS"})} />
        )}
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding:"52px clamp(16px,4vw,40px)", maxWidth:1200, margin:"0 auto" }} aria-busy="true" aria-label="Loading cloud data">
      <Skeleton width={220} height={36} borderRadius={8} />
      <div style={{ height:12 }} />
      <Skeleton width={340} height={16} borderRadius={6} />
      <div style={{ height:36 }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(268px,1fr))", gap:16 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background:tokens.colors.bg2, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.lg, padding:24, display:"flex", flexDirection:"column", gap:14 }}>
            <Skeleton width={46} height={46} borderRadius={12} />
            <Skeleton width={140} height={20} />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              <Skeleton height={32} /><Skeleton height={32} /><Skeleton height={32} />
            </div>
            <Skeleton height={44} />
          </div>
        ))}
      </div>
    </div>
  );
}
