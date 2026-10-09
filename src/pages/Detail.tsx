import { useState } from 'react'
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from "../router-compat"
import { NftCard, NftImg } from '../components'
import { NFTS, eth } from '../data'
import { useCart } from '../cart'

export default function Detail() {
  const { id } = useParams()
  const nft = NFTS.find(n => n.id === Number(id))
  const [qty, setQty] = useState(1)
  const [fav, setFav] = useState(false)
  const { add } = useCart()
  const nav = useNavigate()
  if (!nft) return <p>NFT não encontrado. <Link className="text-brand" to="/">Voltar ao início</Link></p>

  return (
    <>
      <article className="mobile-detail md:hidden">
        <div className="detail-art">
          <NftImg id={nft.id} />
          <Link to="/" aria-label="Voltar" className="detail-back"><ArrowLeft size={15} /></Link>
          <button aria-label="Favoritar" aria-pressed={fav} onClick={() => setFav(f => !f)} className="detail-heart"><Heart size={16} fill={fav ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="detail-info">
          <div className="flex items-center justify-between gap-2"><h1>{nft.name}</h1><span className="detail-rating"><Star size={10} fill="currentColor" />4.8(19)</span></div>
          <p className="detail-description">Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na {nft.network}.</p>
          <p className="mb-1 text-ink">Edição:</p>
          <div className="edition-options"><span>1/10</span><span>1/10</span><span className="selected">1/50</span><span>ABERTA</span></div>
          <p>ID do token: {nft.tokenId}</p><p>Coleção: Kurio Apes</p><p>Atributos: Óculos, Esmeralda, Raro</p>
        </div>
        <div className="detail-purchase">
          <div className="flex items-center gap-2"><span className="text-mute">Qtd.</span><button aria-label="Diminuir" className="quantity-button" onClick={() => setQty(q => Math.max(1,q-1))}><Minus size={12} /></button><span>{qty}</span><button aria-label="Aumentar" className="quantity-button" onClick={() => setQty(q => q+1)}><Plus size={12} /></button><strong className="ml-auto text-brand">{eth(nft.price)}</strong></div>
          <div className="mt-4 flex gap-3"><button className="mobile-pill" onClick={() => { add(nft.id,qty); nav('/carrinho') }}>Comprar NFT</button><button className="detail-cart" aria-label="Adicionar ao carrinho" onClick={() => add(nft.id,qty)}><ShoppingCart size={16} /></button></div>
        </div>
      </article>
      <div className="hidden md:block">
      <p className="mb-4 text-mute"><Link to="/">Início</Link> / Mercado</p>
      <div className="grid gap-6 md:grid-cols-2">
        <NftImg id={nft.id} />
        <div>
          <h1 className="text-xl font-bold">{nft.name}</h1>
          <p className="my-2 text-lg font-bold text-brand">{eth(nft.price)}</p>
          <p className="mb-3 text-mute">Um colecionável digital 1/10 finalizado à mão da coleção Kurio Editions, verificado na {nft.network}.</p>
          <p className="text-mute">ID do token: {nft.tokenId}<br />Coleção: {nft.collection}<br />Rede: {nft.network}</p>
          <div className="my-4 flex flex-wrap items-center gap-2">
            <button className="btn-ghost" aria-label="Diminuir" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={12} /></button>
            <span className="w-6 text-center">{qty}</span>
            <button className="btn-ghost" aria-label="Aumentar" onClick={() => setQty(q => q + 1)}><Plus size={12} /></button>
            <button className="btn" onClick={() => { add(nft.id, qty); nav('/carrinho') }}>COMPRAR NFT</button>
            <button className="btn-ghost flex items-center gap-1" aria-label="Favoritar" aria-pressed={fav} onClick={() => setFav(f => !f)}><Heart size={13} className={fav ? "fill-brand text-brand" : ""} /> Favoritar</button>
          </div>
        </div>
      </div>
      <h2 className="mb-3 mt-10 font-bold text-brand">Mais desta coleção</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{NFTS.filter(n => n.id !== nft.id).slice(0, 5).map(n => <NftCard key={n.id} nft={n} />)}</div>
      </div>
    </>
  )
}
