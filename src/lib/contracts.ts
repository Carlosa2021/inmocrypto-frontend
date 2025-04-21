import { getContract } from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { client } from './thirdweb/client-browser';

export const nftCollectionContract = getContract({
  client,
  address: '0x3e45860ee64AFbE1E2251691C1494F1984544aF5', // NFT Collection
  chain: polygon,
});

export const marketplaceContract = getContract({
  client,
  address: '0x3fD5B4F1058416ea6BEeAc7dd3b239DD014a07a6', // Marketplace V3
  chain: polygon,
});
