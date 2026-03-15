"use client";

import { tokens } from "@/tokens";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Gauge } from "@/components/ui/Gauge";
import { Badge } from "@/components/ui/Badge";
import type { Cluster, Provider } from "@/types/cloud";

interface ClusterDetailProps {
  provider: Provider;
  cluster: Cluster;
  onBack: () => void;
  onBackToProviders: () => void;
}

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function ClusterDetail({ provider, cluster, onBack, onBackToProviders }: ClusterDetailProps) {
  const effColor =
    cluster.efficiency >= 40 ? tokens.colors.accentGreen :
    cluster.efficiency >= 20 ? tokens.colors.accentAmber :
    tokens.colors.accentRed;

  return (
    <section className="anim-sl" aria-labelledby="cluster-heading">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32, flexWrap:"wrap" }}>
        <BackButton onClick={onBack} label={`Back to ${provider.name} clusters`} />
        <Breadcrumb items={[
          { label:"All Providers", onClick:onBackToProviders },
          { label:provider.shortName, onClick:onBack },
          { label:cluster.name },
        ]} />
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <h2 id="cluster-heading" style={{ fontSize:"clamp(22px,3vw,30px)", fontWeight:700, color:tokens.colors.textPrimary }}>
            {cluster.name}
          </h2>
          <Badge active={cluster.active} />
          <span style={{ fontSize:12, color:tokens.colors.textMuted, fontFamily:tokens.font.mono, background:tokens.colors.bg1, border:`1px solid ${tokens.colors.border}`, padding:"2px 10px", borderRadius:6 }}>
            {cluster.slug}
          </span>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontSize:11, color:tokens.colors.textMuted, marginBottom:2 }}>Monthly total</p>
          <p style={{ fontSize:28, fontWeight:700, fontFamily:tokens.font.mono, color:tokens.colors.textPrimary }}>{fmt(cluster.total)}</p>
        </div>
      </div>

      {/* Gauges */}
      <div style={{ background:tokens.colors.bg2, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.lg, padding:"28px 24px", marginBottom:18 }}>
        <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:10 }}>
          <div>
            <h3 style={{ fontSize:14, fontWeight:700, color:tokens.colors.textSecondary, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4 }}>Resource Utilisation</h3>
            <p style={{ fontSize:13, color:tokens.colors.textMuted }}>Used vs requested — last 30 days</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 18px", background:tokens.colors.bg1, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.md }}>
            <span style={{ fontSize:12, color:tokens.colors.textMuted }}>Efficiency</span>
            <span style={{ fontSize:22, fontWeight:700, fontFamily:tokens.font.mono, color:effColor }}>{cluster.efficiency}%</span>
          </div>
        </header>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:32, justifyItems:"center" }}>
          <div className="anim-up d1"><Gauge label="CPU" used={cluster.cpuUsed} requested={cluster.cpuRequested} color={tokens.colors.accentGreen} /></div>
          <div className="anim-up d2"><Gauge label="RAM" used={cluster.ramUsed} requested={cluster.ramRequested} color={tokens.colors.accentBlue} /></div>
          <div className="anim-up d3"><Gauge label="GPU" used={cluster.gpuUsed} requested={cluster.gpuRequested} color={cluster.gpuRequested > 0 ? tokens.colors.accentAmber : tokens.colors.textMuted} /></div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div style={{ background:tokens.colors.bg2, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.lg, padding:"20px", marginBottom:18 }}>
        <h3 style={{ fontSize:11, fontWeight:700, color:tokens.colors.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:16 }}>Cost Breakdown</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:12 }}>
          {[{label:"CPU",val:cluster.cpu},{label:"RAM",val:cluster.ram},{label:"Storage",val:cluster.storage},{label:"Network",val:cluster.network},{label:"GPU",val:cluster.gpu}].map(({label,val}) => (
            <div key={label} style={{ background:tokens.colors.bg1, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.md, padding:"12px 14px" }}>
              <p style={{ fontSize:11, color:tokens.colors.textMuted, marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:16, fontWeight:700, fontFamily:tokens.font.mono, color:val===0?tokens.colors.textMuted:tokens.colors.textPrimary }}>{val===0?"—":fmt(val)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Namespace table */}
      <div style={{ background:tokens.colors.bg2, border:`1px solid ${tokens.colors.border}`, borderRadius:tokens.radius.lg, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${tokens.colors.border}`, background:tokens.colors.bg1 }}>
          <h3 style={{ fontSize:11, fontWeight:700, color:tokens.colors.textMuted, letterSpacing:"0.06em", textTransform:"uppercase" }}>Namespaces ({cluster.namespaces.length})</h3>
        </div>

        <div role="rowgroup" style={{ display:"grid", gridTemplateColumns:"minmax(120px,1fr) repeat(7, minmax(68px,1fr))", padding:"10px 20px", borderBottom:`1px solid ${tokens.colors.border}` }}>
          {["Namespace","CPU","RAM","Storage","Network","GPU","Efficiency","Total"].map((col,i) => (
            <span key={col} style={{ fontSize:11, color:tokens.colors.textMuted, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase", textAlign:i===0?"left":"right" }}>{col}</span>
          ))}
        </div>

        {cluster.namespaces.map((ns, i) => {
          const nsEff = ns.efficiency>=40?tokens.colors.accentGreen:ns.efficiency>=20?tokens.colors.accentAmber:tokens.colors.accentRed;
          return (
            <div key={ns.id} className={`anim-up d${Math.min(i+1,4)}`} role="row" aria-label={`${ns.name}, total ${fmt(ns.total)}`}
              style={{ display:"grid", gridTemplateColumns:"minmax(120px,1fr) repeat(7, minmax(68px,1fr))", padding:"14px 20px", borderBottom:i<cluster.namespaces.length-1?`1px solid ${tokens.colors.border}`:"none", alignItems:"center" }}>
              <span style={{ fontSize:14, fontWeight:700, color:tokens.colors.textPrimary }}>{ns.name}</span>
              {[ns.cpu,ns.ram,ns.storage,ns.network,ns.gpu].map((v,vi) => (
                <span key={vi} style={{ textAlign:"right", fontSize:13, fontFamily:tokens.font.mono, color:tokens.colors.textSecondary }}>{v===0?"—":fmt(v)}</span>
              ))}
              <span style={{ textAlign:"right", fontSize:13, fontFamily:tokens.font.mono, color:nsEff, fontWeight:600 }}>{ns.efficiency}%</span>
              <span style={{ textAlign:"right", fontSize:13, fontFamily:tokens.font.mono, fontWeight:700, color:tokens.colors.textPrimary }}>{fmt(ns.total)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ background:"none", border:`1px solid ${tokens.colors.border}`, color:tokens.colors.textSecondary, padding:"6px 14px", borderRadius:20, cursor:"pointer", fontFamily:tokens.font.sans, fontSize:13, transition:"all 0.2s", flexShrink:0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=tokens.colors.borderGreen; (e.currentTarget as HTMLElement).style.color=tokens.colors.textPrimary; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=tokens.colors.border; (e.currentTarget as HTMLElement).style.color=tokens.colors.textSecondary; }}>
      ← Back
    </button>
  );
}
