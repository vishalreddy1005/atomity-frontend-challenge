import { providerMeta } from "@/tokens";
import type { Cluster, Namespace, Provider } from "@/types/cloud";

interface JPUser {
  id: number;
  username: string;
  address: { geo: { lat: string; lng: string } };
  company: { bs: string };
}

function userToCluster(user: JPUser, clusterIndex: number): Cluster {
  const s = user.id;
  const lat = Math.abs(parseFloat(user.address.geo.lat));
  const lng = Math.abs(parseFloat(user.address.geo.lng));

  const cpu      = Math.round(480 + lat * 38 + s * 82);
  const ram      = Math.round(cpu * (0.50 + (lng % 10) / 100));
  const storage  = Math.round(cpu * 0.095);
  const network  = Math.round(cpu * 0.120);
  const hasGpu   = s % 3 === 0;
  const gpu      = hasGpu ? Math.round(cpu * 0.33) : 0;
  const efficiency = Math.round(8 + ((lat + lng) % 57));
  const total    = cpu + ram + storage + network + gpu;
  const active   = s % 5 !== 4; // ≈ 80 % active

  const namespaces: Namespace[] = (["A", "B", "C", "D"] as const).map(
    (letter, i) => {
      const ratio = [0.42, 0.28, 0.18, 0.12][i];
      const nsEff = Math.min(Math.round(efficiency + i * 9), 88);
      return {
        id:         `ns-${user.id}-${i}`,
        name:       `Namespace ${letter}`,
        cpu:        Math.round(cpu * ratio),
        ram:        Math.round(ram * ratio),
        storage:    Math.round(storage * ratio),
        network:    Math.round(network * ratio),
        gpu:        Math.round(gpu * ratio),
        efficiency: nsEff,
        total:      Math.round(total * ratio),
      };
    },
  );

  return {
    id:           user.id,
    name:         `Cluster ${String.fromCharCode(64 + clusterIndex)}`,
    slug:         user.username,
    active,
    cpu,
    ram,
    storage,
    network,
    gpu,
    efficiency,
    total,
    cpuRequested: cpu,
    ramRequested: ram,
    gpuRequested: gpu,
    cpuUsed:      Math.round(cpu * efficiency / 100),
    ramUsed:      Math.round(ram * efficiency / 100),
    gpuUsed:      hasGpu ? Math.round(gpu * efficiency / 100) : 0,
    namespaces,
  };
}

/**
 * Map 10 JSONPlaceholder users → 4 cloud providers, each with 1–4 clusters.
 */
export function buildProviders(users: JPUser[]): Provider[] {
  const assignments: { id: keyof typeof providerMeta; indices: number[] }[] = [
    { id: "aws",   indices: [0, 1, 2, 3] },
    { id: "gcp",   indices: [4, 5] },
    { id: "azure", indices: [6, 7, 8] },
    { id: "oci",   indices: [9] },
  ];

  return assignments.map(({ id, indices }) => {
    const meta = providerMeta[id];
    const clusters = indices
      .filter((i) => i < users.length)
      .map((userIdx, clusterIdx) => userToCluster(users[userIdx], clusterIdx + 1));

    const totalCost      = clusters.reduce((s, c) => s + c.total, 0);
    const avgEfficiency  = Math.round(
      clusters.reduce((s, c) => s + c.efficiency, 0) / clusters.length,
    );
    const activeCount    = clusters.filter((c) => c.active).length;

    return {
      id,
      ...meta,
      clusters,
      totalCost,
      avgEfficiency,
      activeCount,
      totalCount: clusters.length,
    };
  });
}
