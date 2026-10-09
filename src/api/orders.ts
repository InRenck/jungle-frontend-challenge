import { api } from "./client";

export type Order = {
  id: string;
  transactionId: string;
  status: "confirmed";
  lines: {
    id: number;
    qty: number;
    name: string;
    unitPrice: string;
  }[];
  subtotal: string;
  fee: string;
  total: string;
  wallet: string;
  account: string;
};

export type OrderInput = {
  lines: { id: number; qty: number }[];
  wallet: string;
  account: string;
};

export async function createOrder(
  input: OrderInput,
  idempotencyKey: string
): Promise<Order> {
  const { data } = await api.post<Order>(
    "/orders",
    input,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}