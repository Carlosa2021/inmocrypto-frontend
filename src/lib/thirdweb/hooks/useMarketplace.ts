'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAllListings,
  getAllAuctions,
  createListing,
  createAuction,
  getAuction,
} from 'thirdweb/extensions/marketplace';
import { marketplaceContract } from '../../contracts';

/**
 * Listados directos (compra instantánea)
 */
export function useDirectListings(filters?: {
  seller?: string;
  page?: number;
  perPage?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['direct-listings', filters],
    queryFn: async () =>
      getAllListings({
        contract: marketplaceContract,
        ...filters,
      }),
  });
  return { listings: data, isLoading, error };
}

/**
 * Subastas activas
 */
export function useAuctionListings(filters?: {
  seller?: string;
  page?: number;
  perPage?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['auction-listings', filters],
    queryFn: async () =>
      getAllAuctions({
        contract: marketplaceContract,
        ...filters,
      }),
  });
  return { auctions: data, isLoading, error };
}

/**
 * Crear un listado directo
 */
export function useCreateDirectListing() {
  return useMutation({
    mutationFn: async ({
      assetContractAddress,
      tokenId,
      pricePerToken,
      startTimestamp,
      endTimestamp,
    }: {
      assetContractAddress: string;
      tokenId: bigint | number | string;
      pricePerToken: string;
      startTimestamp?: Date;
      endTimestamp?: Date;
    }) =>
      createListing({
        contract: marketplaceContract,
        assetContractAddress,
        tokenId: typeof tokenId === 'bigint' ? tokenId : BigInt(tokenId),
        pricePerToken,
        startTimestamp,
        endTimestamp,
      }),
  });
}

/**
 * Crear subasta (auction) — ahora con minimumBidAmountWei y buyoutBidAmountWei (bigint en wei)
 */
export function useCreateAuction() {
  return useMutation({
    mutationFn: async ({
      assetContractAddress,
      tokenId,
      minimumBidAmountWei, // bigint, en wei
      buyoutBidAmountWei, // bigint, en wei
      currencyContractAddress,
      startTimestamp,
      endTimestamp,
      quantity,
      timeBufferInSeconds,
      bidBufferBps,
    }: {
      assetContractAddress: string;
      tokenId: bigint | number | string;
      minimumBidAmountWei: bigint; // obligatorio
      buyoutBidAmountWei: bigint; // obligatorio
      currencyContractAddress?: string;
      startTimestamp?: Date;
      endTimestamp?: Date;
      quantity?: bigint;
      timeBufferInSeconds?: number;
      bidBufferBps?: number;
    }) =>
      createAuction({
        contract: marketplaceContract,
        assetContractAddress,
        tokenId: typeof tokenId === 'bigint' ? tokenId : BigInt(tokenId),
        minimumBidAmountWei,
        buyoutBidAmountWei,
        currencyContractAddress,
        startTimestamp,
        endTimestamp,
        quantity,
        timeBufferInSeconds,
        bidBufferBps,
      }),
  });
}

/**
 * Obtener info de una subasta puntual
 */
export function useAuctionDetails(auctionId: bigint | number | string) {
  return useQuery({
    queryKey: ['auction-details', auctionId],
    queryFn: async () =>
      getAuction({
        contract: marketplaceContract,
        auctionId:
          typeof auctionId === 'bigint' ? auctionId : BigInt(auctionId),
      }),
    enabled: !!auctionId,
  });
}
