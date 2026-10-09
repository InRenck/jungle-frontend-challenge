import { http, HttpResponse, delay } from "msw";
import { NFTS } from "../data";

type OrderLine = {
  id: number;
  qty: number;
  name: string;
  unitPrice: string;
};

type Order = {
  id: string;
  transactionId: string;
  status: "confirmed";
  lines: OrderLine[];
  subtotal: string;
  fee: string;
  total: string;
  wallet: string;
  account: string;
};

type StoredOrder = {
  fingerprint: string;
  order: Order;
};

const ORDER_STORAGE = "kurio-mock-orders";

function readOrders(): Record<string, StoredOrder> {
  try {
    return JSON.parse(localStorage.getItem(ORDER_STORAGE) || "{}");
  } catch {
    return {};
  }
}

function saveOrders(orders: Record<string, StoredOrder>) {
  localStorage.setItem(ORDER_STORAGE, JSON.stringify(orders));
}

export const handlers = [
  http.get("/api/nfts", async ({ request }) => {
    await delay(350);

    const url = new URL(request.url);
    const search = url.searchParams.get("search") ?? "";
    const collection = url.searchParams.get("collection");
    const network = url.searchParams.get("network");
    const max = Number(url.searchParams.get("max") ?? 12.3);
    const sort = url.searchParams.get("sort") ?? "";
    const tab = url.searchParams.get("tab") ?? "";
    const page = Math.max(
      1,
      Number(url.searchParams.get("page") ?? 1)
    );
    const limit = 9;

    let items = NFTS.filter(n =>
      n.name.toLowerCase().includes(search.toLowerCase()) &&
      (!collection || n.collection === collection) &&
      (!network || n.network === network) &&
      n.price <= max
    );

    if (tab === "Novos lançamentos") {
      items = [...items].sort((a, b) => b.id - a.id);
    }

    if (tab === "Em alta") {
      items = items.filter(n => n.rare || n.price >= 1.3);
    }

    if (sort === "Menor preço") {
      items = [...items].sort((a, b) => a.price - b.price);
    }

    if (sort === "Maior preço") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return HttpResponse.json({
      items: items.slice((page - 1) * limit, page * limit),
      total: items.length,
      page,
      pages: Math.max(1, Math.ceil(items.length / limit)),
    });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = NFTS.find(n => n.id === Number(params.id));

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 }
      );
    }

    return HttpResponse.json(nft);
  }),
  http.post("/api/orders", async ({ request }) => {
  await delay(500);

  const key = request.headers.get("Idempotency-Key");

  if (!key) {
    return HttpResponse.json(
      { message: "Chave de idempotência obrigatória" },
      { status: 400 }
    );
  }

  const body = await request.json() as {
    lines: { id: number; qty: number }[];
    wallet: string;
    account: string;
  };

  const fingerprint = JSON.stringify(body);
  const orders = readOrders();

  if (orders[key]) {
    if (orders[key].fingerprint !== fingerprint) {
      return HttpResponse.json(
        { message: "Chave reutilizada com dados diferentes" },
        { status: 409 }
      );
    }

    return HttpResponse.json(orders[key].order);
  }

  if (
    !Array.isArray(body.lines) ||
    !body.lines.length ||
    !body.wallet ||
    !body.account
  ) {
    return HttpResponse.json(
      { message: "Dados inválidos" },
      { status: 400 }
    );
  }

  const lines: OrderLine[] = [];

  for (const item of body.lines) {
    const nft = NFTS.find(n => n.id === item.id);

    if (
      !nft ||
      !Number.isSafeInteger(item.qty) ||
      item.qty < 1
    ) {
      return HttpResponse.json(
        { message: "NFT ou quantidade inválida" },
        { status: 409 }
      );
    }

    lines.push({
      id: nft.id,
      qty: item.qty,
      name: nft.name,
      unitPrice: nft.price.toFixed(3),
    });
  }

  // Cálculo em unidades inteiras de 0.001 ETH.
  const subtotalUnits = lines.reduce(
    (sum, line) =>
      sum + Math.round(Number(line.unitPrice) * 1000) * line.qty,
    0
  );

  const feeUnits = 16;

  const order: Order = {
    id: crypto.randomUUID(),
    transactionId: `0x${crypto.randomUUID().replace(/-/g, "")}`,
    status: "confirmed",
    lines,
    subtotal: (subtotalUnits / 1000).toFixed(3),
    fee: (feeUnits / 1000).toFixed(3),
    total: ((subtotalUnits + feeUnits) / 1000).toFixed(3),
    wallet: body.wallet,
    account: body.account,
  };

  orders[key] = { fingerprint, order };
  saveOrders(orders);

  return HttpResponse.json(order, { status: 201 });
}),

http.get("/api/orders/:id", ({ params }) => {
  const orders = readOrders();

  const entry = Object.values(orders).find(
    item => item.order.id === params.id
  );

  if (!entry) {
    return HttpResponse.json(
      { message: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  return HttpResponse.json(entry.order);
}),
];
