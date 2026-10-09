import { useMemo, useState } from 'react'
import { NftCard, NftImg } from '../components'
import { COLLECTIONS, NETWORKS, NFTS } from '../data'

export default function Home() {
  const [collection, setCollection] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [max, setMax] = useState(12.3)
  const list = useMemo(() => NFTS.filter(n => (!collection || n.collection === collection) && (!network || n.network === network) && n.price <= max), [collection, network, max])
  const pick = (cur: string | null, v: string, set: (s: string | null) => void) => set(cur === v ? null : v)

  return (
    <>
      <section className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-mute">Bem-vindo à Kurio</p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">SEJA DONO DO FUTURO DA ARTE DIGITAL</h1>
          <p className="my-4 max-w-md text-mute">Descubra NFTs selecionados de criadores emergentes e consagrados, colecione arte verificada e faça parte da cultura on-chain.</p>
          <a href="#explorar" className="btn inline-block">EXPLORAR</a>
        </div>
        <NftImg id={1} className="max-h-96 w-full" />
      </section>

      <section id="explorar" className="mt-10 grid gap-6 md:grid-cols-[200px_1fr]">
        <aside className="panel h-fit space-y-5 p-3">
          <div>
            <h3 className="mb-2 font-bold">Coleções</h3>
            <ul className="space-y-1">
              {COLLECTIONS.map(([name, n]) => (
                <li key={name}><button onClick={() => pick(collection, name, setCollection)} className={`flex w-full cursor-pointer justify-between ${collection === name ? 'text-brand' : 'text-mute hover:text-ink'}`}><span>{name}</span><span>({n})</span></button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold">Faixa de preço</h3>
            <input type="range" min={0.1} max={12.3} step={0.1} value={max} onChange={e => setMax(+e.target.value)} className="w-full accent-brand" aria-label="Preço máximo" />
            <p className="text-mute">Preço: 0,02 - {max.toFixed(2)} ETH</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold">Rede</h3>
            <ul className="space-y-1">
              {NETWORKS.map(([name, n]) => (
                <li key={name}><button onClick={() => pick(network, name, setNetwork)} className={`flex w-full cursor-pointer justify-between ${network === name ? 'text-brand' : 'text-mute hover:text-ink'}`}><span>{name}</span><span>({n})</span></button></li>
              ))}
            </ul>
          </div>
        </aside>
        <div>
          <div className="mb-3 flex flex-wrap gap-4 border-b border-line pb-2">
            <button className="border-b-2 border-brand text-brand">Todos os NFTs</button>
            <button className="text-mute">Novos lançamentos</button>
            <button className="text-mute">Em alta</button>
          </div>
          {list.length ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{list.map(n => <NftCard key={n.id} nft={n} />)}</div>
          ) : (
            <p className="text-mute">Nenhum NFT encontrado. Remova um filtro para ver mais resultados.</p>
          )}
        </div>
      </section>
    </>
  )
}
