export type Nft = { id: number; name: string; tokenId: string; price: number; oldPrice?: number; rare?: boolean; collection: string; network: string }
export const NFTS: Nft[] = [
  { id: 1, name: 'Emerald Ape #042', tokenId: '#0042', price: 1.19, collection: 'Arte digital', network: 'Ethereum' },
  { id: 2, name: 'Sage Nomad #009', tokenId: '#0009', price: 1.69, collection: 'Arte digital', network: 'Polygon' },
  { id: 3, name: 'Neon Vessel #552', tokenId: '#0552', price: 1.99, oldPrice: 2.29, rare: true, collection: 'Generativa', network: 'Ethereum' },
  { id: 4, name: 'Cosmic Bloom #118', tokenId: '#0118', price: 1.29, collection: 'Arte 3D', network: 'Solana' },
  { id: 5, name: 'Violet Nomad #314', tokenId: '#0314', price: 1.39, collection: 'Arte digital', network: 'Ethereum' },
  { id: 6, name: 'Ivory Baron #088', tokenId: '#0088', price: 1.79, collection: 'Colecionáveis', network: 'Polygon' },
  { id: 7, name: 'Golden Beat #207', tokenId: '#0207', price: 0.99, collection: 'Música', network: 'Solana' },
  { id: 8, name: 'Golden Frequency #071', tokenId: '#0071', price: 0.59, collection: 'Música', network: 'Ethereum' },
  { id: 9, name: 'Golden Signal #160', tokenId: '#0160', price: 0.39, collection: 'Jogos', network: 'Polygon' },
]
export const COLLECTIONS = [['Arte digital', 88], ['Fotografia', 12], ['Música', 65], ['Arte 3D', 39], ['Colecionáveis', 23], ['Generativa', 17], ['Jogos', 19], ['Assinaturas', 13], ['Utilidade', 18]] as const
export const NETWORKS = [['Ethereum', 119], ['Polygon', 78], ['Solana', 96]] as const
export const NETWORK_FEE = 0.016
export const eth = (n: number) => `${n.toFixed(2)} ETH`

export const IMG: Record<number, string> = {
  1: '/nfts/hero-nft.png',       // Emerald Ape (jaqueta verde)
  2: '/nfts/NFTArtwork-04.png',  // Sage Nomad (chapéu)
  3: '/nfts/NFTArtwork-05.png',  // Neon Vessel (gorila preto)
  4: '/nfts/NFTArtwork-04.png',  // Cosmic Bloom (chapéu)
  5: '/nfts/NFTArtwork-04.png',  // Violet Nomad (fone laranja)
  6: '/nfts/NFTArtwork-05.png',  // Ivory Baron (gorila preto)
  7: '/nfts/NFTArtwork-09.png',       // Golden Beat (jaqueta verde)
  8: '/nfts/NFTArtwork-09.png', 
  9: '/nfts/NFTArtwork-09.png',  // Golden Signal (fone laranja)
}