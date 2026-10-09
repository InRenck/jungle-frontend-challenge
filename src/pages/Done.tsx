import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NftImg } from "../components";
import { getOrder } from "../api/orders";

export default function Done() {
  const [params] = useSearchParams();
  const id = params.get("id");

  const { data: order, isPending, isError, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id!),
    enabled: Boolean(id),
    retry: 1,
  });

  if (!id) {
    return (
      <p>
        Nenhum pedido informado.{" "}
        <Link className="text-brand" to="/">
          Voltar ao início
        </Link>
      </p>
    );
  }

  if (isPending) {
    return (
      <div role="status" className="panel mx-auto max-w-md p-5">
        <div className="h-8 animate-pulse rounded bg-line motion-reduce:animate-none" />
        <p className="mt-4 text-mute">Consultando pedido...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div role="alert" className="panel mx-auto max-w-md p-5">
        <p>Não foi possível recuperar o pedido.</p>
        <button
          className="btn mt-4"
          onClick={() => refetch()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (order.status !== "confirmed") {
    return (
      <p role="status">
        O pedido ainda não foi confirmado.
      </p>
    );
  }

  return (
    <div className="panel mx-auto max-w-md p-5">
      <h1 className="mb-4 text-center font-bold text-brand">
        Compra confirmada!
      </h1>

      <p className="mb-4 text-center text-mute">
        Seu pedido foi confirmado pela simulação.
      </p>

      <div className="mb-4 grid grid-cols-3 gap-2 border-y border-line py-3 text-xs text-mute">
        <span className="min-w-0">
          Transação
          <b className="block truncate text-ink" title={order.transactionId}>
            {order.transactionId.slice(0, 12)}...
          </b>
        </span>

        <span>
          Total
          <b className="block text-ink">
            {order.total} ETH
          </b>
        </span>

        <span>
          Carteira
          <b className="block break-words text-ink">
            {order.wallet}
          </b>
        </span>
      </div>

      <h2 className="mb-3 font-bold">NFTs adquiridos</h2>

      {order.lines.map(line => (
        <div
          key={line.id}
          className="mb-3 flex items-center gap-2"
        >
          <NftImg id={line.id} className="w-10 shrink-0" />

          <span className="flex-1">
            {line.name}
            <span className="ml-1 text-mute">
              (× {line.qty})
            </span>
          </span>

          <b className="text-brand">
            {(
              Number(line.unitPrice) * line.qty
            ).toFixed(3)}{" "}
            ETH
          </b>
        </div>
      ))}

      <div className="mt-4 space-y-2 border-t border-line pt-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{order.subtotal} ETH</span>
        </div>

        <div className="flex justify-between">
          <span>Taxa de rede</span>
          <span>{order.fee} ETH</span>
        </div>

        <div className="flex justify-between font-bold text-brand">
          <span>Total</span>
          <span>{order.total} ETH</span>
        </div>
      </div>

      <Link
        to="/"
        className="btn mx-auto mt-5 block w-fit"
      >
        Voltar ao início
      </Link>
    </div>
  );
}