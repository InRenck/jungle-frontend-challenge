import { useState } from 'react'
import { MoreVertical, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { NftImg } from '../components'
import { NFTS, eth } from '../data'
import { useCart } from '../cart'
import { Summary } from './Cart'

const WALLETS = ['WalletConnect', 'MetaMask', 'Coinbase Wallet']
const FIELDS = ['Nome de exibição', 'Nome de usuário', 'Apelido da carteira', 'Nome do perfil', 'Endereço da carteira', 'Código de indicação', 'E-mail', 'Nome ENS']

export default function Checkout() {
  const { lines, subtotal, fee, total, clear } = useCart()
  const [wallet, setWallet] = useState('Coinbase Wallet')
  const [account, setAccount] = useState('Reserva')
  const nav = useNavigate()
  if (!lines.length) return <p>Nada para pagar. <Link className="text-brand" to="/">Explorar NFTs</Link></p>

  const confirm = (e: React.FormEvent) => {
    e.preventDefault()
    nav('/confirmacao', { state: { lines, total, wallet, account } })
    clear()
  }
  return (
    <>
      <form className="mobile-checkout md:hidden" onSubmit={confirm}>
        <div className="flex items-center justify-between mb-3"><h2>Carteira conectada</h2><button type="button" className="text-brand" onClick={() => setAccount(a => a === 'Reserva' ? 'Principal' : 'Reserva')}>Trocar carteira</button></div>
        <div className="space-y-3">
          {['Reserva', 'Principal'].map(a => <label key={a} className="mobile-wallet-account"><input type="radio" name="mobile-account" checked={account === a} onChange={() => setAccount(a)} /><span><strong>{a}</strong><small>{a === 'Reserva' ? 'nova.kurio.eth' : '0xA91F…E82c'}</small><small>{a === 'Reserva' ? 'Rede Polygon' : 'Rede principal Ethereum'}</small></span><MoreVertical size={15} className="ml-auto text-mute" /></label>)}
        </div>
        <h2 className="mt-5 mb-3">Carteira e rede</h2>
        <div className="space-y-3">{WALLETS.map((w,i) => <label key={w} className="mobile-wallet-provider"><span className="wallet-symbol">{i === 0 ? 'W' : i === 1 ? 'M' : <Wallet size={15} />}</span><span>{w}</span><input className="ml-auto" type="radio" name="mobile-wallet" checked={wallet === w} onChange={() => setWallet(w)} /></label>)}</div>
        <p className="mt-3 text-right font-bold">Total: <span className="ml-2 text-brand">{total.toFixed(3)} ETH</span></p>
        <button type="submit" className="mobile-pill checkout-confirm">Confirmar compra</button>
      </form>
      <form className="hidden md:block" onSubmit={confirm}>
      <p className="mb-4 text-mute">Início / Mercado / Pagamento</p>
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-3 font-bold">Perfil do colecionador</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {FIELDS.map(f => (
              <label key={f} className="block">{f} <span className="text-brand">*</span>
                <input required className="input mt-1" type={f === 'E-mail' ? 'email' : 'text'} />
              </label>
            ))}
            <label className="block sm:col-span-2">Observação do colecionador (opcional)
              <textarea className="input mt-1 h-28" />
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <div className="panel space-y-2 p-3">
            <h2 className="font-bold">Seus NFTs</h2>
            {lines.map(l => { const n = NFTS.find(x => x.id === l.id)!; return (
              <div key={l.id} className="flex items-center gap-2"><NftImg id={n.id} className="w-10 shrink-0" /><span className="flex-1 truncate">{n.name} (× {l.qty})</span><span className="text-brand">{eth(n.price * l.qty)}</span></div>
            ) })}
          </div>
          <div className="panel p-3">
            <h3 className="mb-2 font-bold">Carteira e rede</h3>
            {WALLETS.map(w => (
              <label key={w} className={`mb-1 flex cursor-pointer items-center gap-2 rounded border p-2 ${wallet === w ? 'border-brand' : 'border-line'}`}>
                <input type="radio" name="wallet" checked={wallet === w} onChange={() => setWallet(w)} className="accent-brand" />{w}
              </label>
            ))}
          </div>
          <Summary subtotal={subtotal} fee={fee} total={total} action={<button className="btn w-full" type="submit">Confirmar compra</button>} />
        </div>
      </div>
    </form>
    </>
  )
}
