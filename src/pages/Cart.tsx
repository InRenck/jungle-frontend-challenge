import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from "../router-compat"
import { NftImg } from '../components'
import { NFTS, eth } from '../data'
import { useCart } from '../cart'

export default function Cart() {
  const { lines, subtotal, fee, total, setQty, remove } = useCart()
  const [promo, setPromo] = useState('')
  const nav = useNavigate()
  const rows = lines.map(l => ({ ...l, nft: NFTS.find(n => n.id === l.id)! }))

  if (!rows.length) return <p>Seu carrinho está vazio. <Link className="text-brand" to="/">Explorar NFTs</Link></p>
  return (
    <>
      <p className="hidden mb-4 text-mute md:block">Início / Mercado / Carrinho</p>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="cart-list space-y-2">
          {rows.map(({ nft, qty }) => (
            <div key={nft.id} className="cart-row panel flex items-center gap-3 p-2">
              <NftImg id={nft.id} className="cart-art w-14 shrink-0" />
              <div className="cart-meta min-w-0 flex-1"><p className="truncate">{nft.name}</p><p className="hidden text-mute md:block">ID do token: {nft.tokenId}</p><p className="text-mute md:hidden">Édition: 1/50</p></div>
              <p className="hidden md:block">{eth(nft.price)}</p>
              <div className="cart-quantity flex items-center gap-1">
                <button className="btn-ghost !px-2 !py-0" aria-label="Diminuir" onClick={() => setQty(nft.id, qty - 1)}><Minus size={12} /></button>
                <span className="w-5 text-center">{qty}</span>
                <button className="btn-ghost !px-2 !py-0" aria-label="Aumentar" onClick={() => setQty(nft.id, qty + 1)}><Plus size={12} /></button>
              </div>
              <p className="cart-price w-20 text-right font-bold text-brand">{eth(nft.price * qty)}</p>
              <button className="cart-remove text-mute hover:text-brand" aria-label={`Remover ${nft.name}`} onClick={() => remove(nft.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <Summary promo={promo} setPromo={setPromo} subtotal={subtotal} fee={fee} total={total} action={<button className="mobile-pill btn w-full" onClick={() => nav('/pagamento')}>Conectar e finalizar</button>} />
      </div>
    </>
  )
}

export function Summary({ promo, setPromo, subtotal, fee, total, action }: { promo?: string; setPromo?: (s: string) => void; subtotal: number; fee: number; total: number; action: React.ReactNode }) {
  return (
    <aside className="cart-summary panel h-fit space-y-2 p-3">
      <h2 className="hidden font-bold md:block">Resumo da carteira</h2>
      {setPromo && <div className="promo-row flex gap-1"><input className="input" placeholder="Digite o código promocional" value={promo} onChange={e => setPromo(e.target.value)} /><button className="btn">Aplicar</button></div>}
      <p className="flex justify-between"><span>Subtotal</span><span>{eth(subtotal)}</span></p>
      <p className="flex justify-between"><span>Desconto do lançamento</span><span>(-) 0.00</span></p>
      <p className="flex justify-between"><span>Taxa de rede</span><span>{fee.toFixed(3)} ETH</span></p>
      <p className="flex justify-between border-t border-line pt-2 font-bold"><span>Total</span><span className="text-brand">{total.toFixed(3)} ETH</span></p>
      {action}
    </aside>
  )
}
