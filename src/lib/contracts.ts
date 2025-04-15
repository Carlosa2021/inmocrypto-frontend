// lib/contracts.ts
import { getContract } from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { client } from './thirdweb/client';
import { NFT_COLLECTION_ADDRESS } from './addresses';

export const nftCollection = getContract({
  client,
  address: NFT_COLLECTION_ADDRESS,
  chain: polygon,
});
