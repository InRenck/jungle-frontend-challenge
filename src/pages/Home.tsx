import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { NftCard, NftImg } from '../components'
import { COLLECTIONS, NETWORKS, NFTS } from '../data'

const PAGE = 9
const TABS = ['Todos os NFTs', 'Novos lançamentos', 'Em alta'] as const
const SORTS = ['Listados recentemente', 'Menor preço', 'Maior preço'] as const

export default function Home() {
  const { hash } = useLocation()
  const [collection, setCollection] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [max, setMax] = useState(12.3)
  const [maxDraft, setMaxDraft] = useState(12.3)
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0])
  const [sort, setSort] = useState<(typeof SORTS)[number]>(SORTS[0])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => { if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }) }, [hash])

  const list = useMemo(() => {
    let l = NFTS.filter(n => (!collection || n.collection === collection) && (!network || n.network === network) && n.price <= max && n.name.toLowerCase().includes(q.toLowerCase()))
    if (tab === 'Novos lançamentos') l = [...l].sort((a, b) => b.id - a.id).slice(0, 18)
    if (tab === 'Em alta') l = l.filter(n => n.rare || n.price >= 1.3)
    if (sort === 'Menor preço') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'Maior preço') l = [...l].sort((a, b) => b.price - a.price)
    return l
  }, [collection, network, max, tab, sort, q])

  const pages = Math.max(1, Math.ceil(list.length / PAGE))
  const cur = Math.min(page, pages)
  const shown = list.slice((cur - 1) * PAGE, cur * PAGE)
  const reset = () => setPage(1)
  const pick = (c: string | null, v: string, set: (s: string | null) => void) => { set(c === v ? null : v); reset() }

  const Filters = (
    <>
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
        <input type="range" min={0.1} max={12.3} step={0.1} value={maxDraft} onChange={e => setMaxDraft(+e.target.value)} className="w-full accent-brand" aria-label="Preço máximo" />
        <p className="mb-2 text-mute">Preço: 0,02 - {maxDraft.toFixed(2)} ETH</p>
        <button className="btn !px-3 !py-1" onClick={() => { setMax(maxDraft); reset() }}>Aplicar</button>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Rede</h3>
        <ul className="space-y-1">
          {NETWORKS.map(([name, n]) => (
            <li key={name}><button onClick={() => pick(network, name, setNetwork)} className={`flex w-full cursor-pointer justify-between ${network === name ? 'text-brand' : 'text-mute hover:text-ink'}`}><span>{name}</span><span>({n})</span></button></li>
          ))}
        </ul>
      </div>
    </>
  )

  return (
    <>
      {/* Busca mobile */}
      <div className="mobile-search mb-4 flex gap-2 md:hidden">
        <label className="panel flex flex-1 items-center gap-2 px-3">
          <Search size={14} className="text-mute" />
          <input value={q} onChange={e => { setQ(e.target.value); reset() }} placeholder="Explorar coleções" aria-label="Buscar" className="w-full bg-transparent py-2.5 outline-none placeholder:text-mute" />
        </label>
        <button aria-label="Filtros" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(o => !o)} className="grid h-10 w-10 place-items-center rounded bg-brand text-bg"><SlidersHorizontal size={16} /></button>
      </div>
      {filtersOpen && <div className="panel mb-4 space-y-5 p-3 md:hidden">{Filters}</div>}

      {/* Hero */}
      <section className="home-hero panel relative grid items-center gap-4 overflow-hidden p-4 md:grid-cols-2 md:gap-6 md:border-0 md:bg-transparent md:p-0">
        <div className="hero-copy max-md:pr-28">
          <p className="mb-2 text-mute">Bem-vindo à Kurio</p>
          <h1 className="text-xl font-bold leading-tight md:text-4xl"><span className="md:hidden">SEJA DONO DA CULTURA DIGITAL</span><span className="hidden md:inline">SEJA DONO DO FUTURO DA ARTE DIGITAL</span></h1>
          <p className="hero-description my-3 max-w-md text-mute max-md:line-clamp-3 md:my-4"><span className="hidden md:inline">Descubra NFTs selecionados de criadores emergentes e consagrados, colecione arte verificada e faça parte da cultura on-chain.</span><span className="md:hidden">Descubra NFTs selecionados de criadores do mundo todo.</span></p>
          <a href="#explorar" className="hero-explore btn inline-block">EXPLORAR <span className="md:hidden">→</span></a>
        </div>
        <NftImg id={1} className="max-md:absolute max-md:right-3 max-md:top-1/2 max-md:w-24 max-md:-translate-y-1/2 md:max-h-96 md:w-full" />
        <NftImg id={2} className="hero-mini md:hidden" />
        <div className="hero-dots hidden justify-center gap-1.5 md:col-span-2 md:flex" aria-hidden><i className="h-1 w-1 rounded-full bg-brand" /><i className="h-1 w-1 rounded-full bg-line" /><i className="h-1 w-1 rounded-full bg-line" /></div>
      </section>

      <section id="explorar" className="home-market mt-8 grid scroll-mt-4 gap-6 md:grid-cols-[200px_1fr]">
        <aside className="hidden h-fit space-y-5 md:block">
          <div className="panel space-y-5 p-3">{Filters}</div>
        </aside>

        <div>
          <div className="market-tabs mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-2">
            {TABS.map(t => <button key={t} onClick={() => { setTab(t); reset() }} className={`cursor-pointer whitespace-nowrap ${tab === t ? 'border-b-2 border-brand text-brand' : 'text-mute hover:text-ink'}`}>{t}</button>)}
            <label className="ml-auto hidden items-center gap-1 text-mute md:flex">Ordenar por:
              <select value={sort} onChange={e => { setSort(e.target.value as (typeof SORTS)[number]); reset() }} className="bg-transparent text-ink outline-none">
                {SORTS.map(s => <option key={s} className="bg-panel">{s}</option>)}
              </select>
            </label>
          </div>

          {shown.length ? (
            <div className="mobile-nft-grid grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">{shown.map(n => <NftCard key={n.id} nft={n} />)}</div>
          ) : (
            <p className="text-mute">Nenhum NFT encontrado. Remova um filtro para ver mais resultados.</p>
          )}

          {pages > 1 && (
            <nav aria-label="Paginação" className="mt-6 flex justify-end gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} aria-current={p === cur} onClick={() => setPage(p)} className={`h-6 w-6 cursor-pointer rounded-sm ${p === cur ? 'bg-brand font-bold text-bg' : 'text-mute hover:text-ink'}`}>{p}</button>
              ))}
              <button aria-label="Próxima página" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid h-6 w-6 place-items-center text-mute disabled:opacity-30"><ChevronRight size={14} /></button>
              {cur > 1 && <button aria-label="Página anterior" onClick={() => setPage(cur - 1)} className="order-first grid h-6 w-6 place-items-center text-mute"><ChevronLeft size={14} /></button>}
            </nav>
          )}
        </div>
      </section>

    </>
  )
}
