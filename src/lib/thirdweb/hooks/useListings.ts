'use client';

import { getAllListings } from 'thirdweb/extensions/marketplace';
import { marketplaceContract } from '../../contracts';
import { useQuery } from '@tanstack/react-query';

export function useDirectListings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['direct-listings'],
    queryFn: async () => getAllListings({ contract: marketplaceContract }),
  });

  return {
    listings: data,
    isLoading,
    error,
  };
}
