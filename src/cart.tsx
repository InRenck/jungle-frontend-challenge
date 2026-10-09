import { createContext, useContext, useState, type ReactNode } from 'react'
import { NFTS, NETWORK_FEE } from './data'

type Line = { id: number; qty: number }
type Ctx = {
  lines: Line[]; count: number; subtotal: number; fee: number; total: number
  add: (id: number, qty?: number) => void; setQty: (id: number, qty: number) => void; remove: (id: number) => void; clear: () => void
}
const CartCtx = createContext<Ctx>(null!)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const add = (id: number, qty = 1) => setLines(l => l.some(x => x.id === id) ? l.map(x => x.id === id ? { ...x, qty: x.qty + qty } : x) : [...l, { id, qty }])
  const setQty = (id: number, qty: number) => setLines(l => l.map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
  const remove = (id: number) => setLines(l => l.filter(x => x.id !== id))
  const clear = () => setLines([])
  const subtotal = lines.reduce((s, l) => s + (NFTS.find(n => n.id === l.id)?.price ?? 0) * l.qty, 0)
  const fee = lines.length ? NETWORK_FEE : 0
  return (
    <CartCtx.Provider value={{ lines, count: lines.reduce((s, l) => s + l.qty, 0), subtotal, fee, total: subtotal + fee, add, setQty, remove, clear }}>
      {children}
    </CartCtx.Provider>
  )
}
