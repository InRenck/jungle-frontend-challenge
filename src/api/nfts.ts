import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { Nft } from "../data";

export type NftFilters = {
  search: string;
  collection: string | null;
  network: string | null;
  max: number;
  sort: string;
  tab: string;
  page: number;
};

type NftResponse = {
  items: Nft[];
  total: number;
  page: number;
  pages: number;
};

export function useNfts(filters: NftFilters) {
  return useQuery({
    queryKey: ["nfts", filters],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<NftResponse>("/nfts", {
        params: filters,
        signal,
      });

      return data;
    },
  });
}