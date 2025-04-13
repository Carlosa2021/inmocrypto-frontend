import { getContract } from 'thirdweb';
import { client } from './thirdweb/client';
import { polygon } from 'thirdweb/chains';

export const NFT_COLLECTION_ADDRESS =
  '0x8aaC036e5D180b672D7Ba0E69249eb97D60B90BF';
export const MARKETPLACE_ADDRESS = '0x6aA3C8ec6D282D5264715D626CB883Bc60e456a3';

export const nftCollection = getContract({
  client,
  address: NFT_COLLECTION_ADDRESS,
  chain: polygon, // ✅ aquí defines la red
});

export const marketplace = getContract({
  client,
  address: MARKETPLACE_ADDRESS,
  chain: polygon, // ✅ también aquí
});
