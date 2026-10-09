import { Link, useLocation } from 'react-router-dom'
import { NftImg } from '../components'
import { NFTS, eth } from '../data'

export default function Done() {
  const state = useLocation().state as { lines: { id: number; qty: number }[]; total: number; wallet: string } | null
  if (!state) return <p>Nenhum pedido recente. <Link className="text-brand" to="/">Voltar ao início</Link></p>
  return (
    <div className="panel mx-auto max-w-md p-5">
      <h1 className="mb-4 text-center font-bold text-brand">Seus NFTs agora estão na sua carteira</h1>
      <div className="mb-4 grid grid-cols-3 gap-2 border-y border-line py-2 text-mute">
        <span>ID da transação<br /><b className="text-ink">0xA91F…E82C</b></span>
        <span>Total<br /><b className="text-ink">{state.total.toFixed(3)} ETH</b></span>
        <span>Carteira<br /><b className="text-ink">{state.wallet}</b></span>
      </div>
      {state.lines.map(l => { const n = NFTS.find(x => x.id === l.id)!; return (
        <div key={l.id} className="mb-2 flex items-center gap-2"><NftImg id={n.id} className="w-10 shrink-0" /><span className="flex-1">{n.name} <span className="text-mute">(× {l.qty})</span></span><b className="text-brand">{eth(n.price * l.qty)}</b></div>
      ) })}
      <p className="mt-4 text-center text-mute">Transação confirmada. A propriedade foi transferida para sua carteira conectada e registrada na rede.</p>
      <Link to="/" className="btn mx-auto mt-4 block w-fit">Voltar ao início</Link>
    </div>
  )
}
