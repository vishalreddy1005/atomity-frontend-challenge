import type { ProviderId } from "@/tokens";

export interface Namespace {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
}

export interface Cluster {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  /** Costs in USD */
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
  /** Requested = allocated ceiling */
  cpuRequested: number;
  ramRequested: number;
  gpuRequested: number;
  /** Actual usage */
  cpuUsed: number;
  ramUsed: number;
  gpuUsed: number;
  namespaces: Namespace[];
}

export interface Provider {
  id: ProviderId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  rgb: string;
  clusters: Cluster[];
  totalCost: number;
  avgEfficiency: number;
  activeCount: number;
  totalCount: number;
}

export type ViewLevel = "providers" | "clusters" | "cluster";

export interface DashboardState {
  view: ViewLevel;
  provider: Provider | null;
  cluster: Cluster | null;
}
