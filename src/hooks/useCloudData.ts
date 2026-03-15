"use client";

import { useQuery } from "@tanstack/react-query";
import { buildProviders } from "@/lib/transformData";
import type { Provider } from "@/types/cloud";

async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const users = await res.json();
  return buildProviders(users);
}

/**
 * Fetches cloud provider data from JSONPlaceholder and transforms it.
 *
 * TanStack Query for caching.
 */
export function useCloudData() {
  return useQuery<Provider[]>({
    queryKey: ["cloud-providers"],
    queryFn:  fetchProviders,
    staleTime: 5  * 60 * 1000,  // 5 minutes
    gcTime:    30 * 60 * 1000,  // 30 minutes
    retry: 2,
  });
}
