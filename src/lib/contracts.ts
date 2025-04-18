import { getContract } from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { client } from './thirdweb/client-browser';

export const nftCollectionContract = getContract({
  client,
  address: '0x8aaC036e5D180b672D7Ba0E69249eb97D60B90BF', // NFT Collection
  chain: polygon,
});

export const marketplaceContract = getContract({
  client,
  address: '0x6aA3C8ec6D282D5264715D626CB883Bc60e456a3', // Marketplace V3
  chain: polygon,
});
