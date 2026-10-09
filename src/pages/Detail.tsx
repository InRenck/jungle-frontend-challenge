import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NftCard, NftImg } from '../components'
import { NFTS, eth } from '../data'
import { useCart } from '../cart'

export default function Detail() {
  const { id } = useParams()
  const nft = NFTS.find(n => n.id === Number(id))
  const [qty, setQty] = useState(1)
  const { add } = useCart()
  const nav = useNavigate()
  if (!nft) return <p>NFT não encontrado. <Link className="text-brand" to="/">Voltar ao início</Link></p>

  return (
    <>
      <p className="mb-4 text-mute"><Link to="/">Início</Link> / Mercado</p>
      <div className="grid gap-6 md:grid-cols-2">
        <NftImg id={nft.id} />
        <div>
          <h1 className="text-xl font-bold">{nft.name}</h1>
          <p className="my-2 text-lg font-bold text-brand">{eth(nft.price)}</p>
          <p className="mb-3 text-mute">Um colecionável digital 1/10 finalizado à mão da coleção Kurio Editions, verificado na {nft.network}.</p>
          <p className="text-mute">ID do token: {nft.tokenId}<br />Coleção: {nft.collection}<br />Rede: {nft.network}</p>
          <div className="my-4 flex items-center gap-2">
            <button className="btn-ghost" aria-label="Diminuir" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="w-6 text-center">{qty}</span>
            <button className="btn-ghost" aria-label="Aumentar" onClick={() => setQty(q => q + 1)}>+</button>
            <button className="btn" onClick={() => { add(nft.id, qty); nav('/carrinho') }}>COMPRAR NFT</button>
            <button className="btn-ghost" onClick={() => add(nft.id, qty)}>Favoritar</button>
          </div>
        </div>
      </div>
      <h2 className="mb-3 mt-10 font-bold text-brand">Mais desta coleção</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{NFTS.filter(n => n.id !== nft.id).slice(0, 5).map(n => <NftCard key={n.id} nft={n} />)}</div>
    </>
  )
}
