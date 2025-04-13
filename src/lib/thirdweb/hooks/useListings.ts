// src/lib/thirdweb/hooks/useListings.ts

'use client';

import { getAllListings } from 'thirdweb/extensions/marketplace';
import { marketplace } from '../../contracts';
import { useQuery } from '@tanstack/react-query';

export function useDirectListings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['direct-listings'],
    queryFn: async () => {
      return await getAllListings({ contract: marketplace });
    },
  });

  return {
    listings: data,
    isLoading,
    error,
  };
}
