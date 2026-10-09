import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { NFTS, NETWORK_FEE } from "./data";

type Line = { id: number; qty: number };

type Ctx = {
  lines: Line[];
  count: number;
  subtotal: number;
  fee: number;
  total: number;
  add: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "kurio-cart";

const CartCtx = createContext<Ctx>(null!);

export const useCart = () => useContext(CartCtx);

function loadCart(): Line[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Line =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "number" &&
        NFTS.some(n => n.id === item.id) &&
        Number.isSafeInteger(item.qty) &&
        item.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lines, setLines] = useState<Line[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(lines)
    );
  }, [lines]);

  const add = (id: number, qty = 1) => {
    if (!NFTS.some(n => n.id === id)) return;
    if (!Number.isSafeInteger(qty) || qty < 1) return;

    setLines(current =>
      current.some(item => item.id === id)
        ? current.map(item =>
            item.id === id
              ? { ...item, qty: item.qty + qty }
              : item
          )
        : [...current, { id, qty }]
    );
  };

  const setQty = (id: number, qty: number) => {
    if (!Number.isSafeInteger(qty)) return;

    setLines(current =>
      current.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const remove = (id: number) => {
    setLines(current =>
      current.filter(item => item.id !== id)
    );
  };

  const clear = () => setLines([]);

  const subtotal = lines.reduce((sum, item) => {
    const nft = NFTS.find(n => n.id === item.id);
    return sum + (nft?.price ?? 0) * item.qty;
  }, 0);

  const fee = lines.length > 0 ? NETWORK_FEE : 0;

  const count = lines.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <CartCtx.Provider
      value={{
        lines,
        count,
        subtotal,
        fee,
        total: subtotal + fee,
        add,
        setQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}