import { useRef, useState, type FormEvent } from "react";
import { MoreVertical, Wallet } from "lucide-react";
import { Link, useNavigate } from "../router-compat";
import { useMutation } from "@tanstack/react-query";

import { NftImg } from "../components";
import { NFTS, eth } from "../data";
import { useCart } from "../cart";
import { Summary } from "./Cart";
import { createOrder, type OrderInput } from "../api/orders";

const WALLETS = [
  "WalletConnect",
  "MetaMask",
  "Coinbase Wallet",
];

const FIELDS = [
  "Nome de exibição",
  "Nome de usuário",
  "Apelido da carteira",
  "Nome do perfil",
  "Endereço da carteira",
  "Código de indicação",
  "E-mail",
  "Nome ENS",
];

const ATTEMPT_KEY = "kurio-order-attempt";

type SavedAttempt = {
  key: string;
  fingerprint: string;
};

export default function Checkout() {
  const {
    lines,
    subtotal,
    fee,
    total,
    clear,
  } = useCart();

  const [wallet, setWallet] = useState("Coinbase Wallet");
  const [account, setAccount] = useState("Reserva");

  const navigate = useNavigate();

  const submitting = useRef(false);

  const orderMutation = useMutation({
    mutationFn: async ({
      input,
      key,
    }: {
      input: OrderInput;
      key: string;
    }) => {
      return createOrder(input, key);
    },

    retry: false,

    onSuccess: order => {
      if (order.status !== "confirmed") {
        submitting.current = false;
        return;
      }

      sessionStorage.removeItem(ATTEMPT_KEY);

      clear();

      navigate(
        `/confirmacao?id=${encodeURIComponent(order.id)}`,
        { replace: true }
      );

      submitting.current = false;
    },

    onError: () => {
      submitting.current = false;
    },
  });

  const confirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      submitting.current ||
      orderMutation.isPending ||
      lines.length === 0
    ) {
      return;
    }

    submitting.current = true;

    const input: OrderInput = {
      lines: lines.map(item => ({
        id: item.id,
        qty: item.qty,
      })),
      wallet,
      account,
    };

    const fingerprint = JSON.stringify(input);

    let key: string | null = null;

    try {
      const saved = sessionStorage.getItem(ATTEMPT_KEY);

      if (saved) {
        const previous = JSON.parse(saved) as SavedAttempt;

        if (
          previous.fingerprint === fingerprint &&
          typeof previous.key === "string"
        ) {
          key = previous.key;
        }
      }
    } catch {
      key = null;
    }

    if (!key) {
      key = crypto.randomUUID();
    }

    sessionStorage.setItem(
      ATTEMPT_KEY,
      JSON.stringify({
        key,
        fingerprint,
      })
    );

    orderMutation.mutate({ input, key });
  };

  // Todos os hooks ficam antes deste retorno.
  if (!lines.length) {
    return (
      <div className="panel p-6 text-center">
        <h1 className="mb-3 text-xl font-bold">
          Seu carrinho está vazio
        </h1>

        <p className="mb-4 text-mute">
          Adicione NFTs ao carrinho para continuar.
        </p>

        <Link className="btn inline-block" to="/">
          Explorar NFTs
        </Link>
      </div>
    );
  }

  const ErrorMessage = orderMutation.isError ? (
    <p
      role="alert"
      className="my-3 text-sm text-red-500"
    >
      Não foi possível confirmar a compra.
      Verifique sua conexão e tente novamente.
    </p>
  ) : null;

  const ConfirmButton = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <button
      type="submit"
      disabled={orderMutation.isPending}
      aria-busy={orderMutation.isPending}
      className={
        mobile
          ? "mobile-pill checkout-confirm disabled:cursor-not-allowed disabled:opacity-50"
          : "btn w-full disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {orderMutation.isPending
        ? "Processando compra..."
        : "Confirmar compra"}
    </button>
  );

  return (
    <>
      <form
        className="mobile-checkout md:hidden"
        onSubmit={confirm}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2>Carteira conectada</h2>

          <button
            type="button"
            className="text-brand"
            onClick={() =>
              setAccount(current =>
                current === "Reserva"
                  ? "Principal"
                  : "Reserva"
              )
            }
          >
            Trocar carteira
          </button>
        </div>

        <div className="space-y-3">
          {["Reserva", "Principal"].map(item => (
            <label
              key={item}
              className="mobile-wallet-account"
            >
              <input
                type="radio"
                name="mobile-account"
                checked={account === item}
                onChange={() => setAccount(item)}
              />

              <span>
                <strong>{item}</strong>

                <small>
                  {item === "Reserva"
                    ? "nova.kurio.eth"
                    : "0xA91F…E82c"}
                </small>

                <small>
                  {item === "Reserva"
                    ? "Rede Polygon"
                    : "Rede principal Ethereum"}
                </small>
              </span>

              <MoreVertical
                size={15}
                className="ml-auto text-mute"
              />
            </label>
          ))}
        </div>

        <h2 className="mb-3 mt-5">
          Carteira e rede
        </h2>

        <div className="space-y-3">
          {WALLETS.map((item, index) => (
            <label
              key={item}
              className="mobile-wallet-provider"
            >
              <span className="wallet-symbol">
                {index === 0 ? (
                  "W"
                ) : index === 1 ? (
                  "M"
                ) : (
                  <Wallet size={15} />
                )}
              </span>

              <span>{item}</span>

              <input
                className="ml-auto"
                type="radio"
                name="mobile-wallet"
                checked={wallet === item}
                onChange={() => setWallet(item)}
              />
            </label>
          ))}
        </div>

        <p className="mt-3 text-right font-bold">
          Total:
          <span className="ml-2 text-brand">
            {total.toFixed(3)} ETH
          </span>
        </p>

        {ErrorMessage}

        <ConfirmButton mobile />
      </form>

      <form
        className="hidden md:block"
        onSubmit={confirm}
      >
        <p className="mb-4 text-mute">
          Início / Mercado / Pagamento
        </p>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-3 font-bold">
              Perfil do colecionador
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS.map(field => (
                <label
                  key={field}
                  className="block"
                >
                  {field}
                  <span className="text-brand">
                    {" "}*
                  </span>

                  <input
                    required
                    className="input mt-1"
                    type={
                      field === "E-mail"
                        ? "email"
                        : "text"
                    }
                  />
                </label>
              ))}

              <label className="block sm:col-span-2">
                Observação do colecionador
                (opcional)

                <textarea
                  className="input mt-1 h-28"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="panel space-y-2 p-3">
              <h2 className="font-bold">
                Seus NFTs
              </h2>

              {lines.map(line => {
                const nft = NFTS.find(
                  item => item.id === line.id
                );

                if (!nft) return null;

                return (
                  <div
                    key={line.id}
                    className="flex items-center gap-2"
                  >
                    <NftImg
                      id={nft.id}
                      className="w-10 shrink-0"
                    />

                    <span className="flex-1 truncate">
                      {nft.name} (× {line.qty})
                    </span>

                    <span className="text-brand">
                      {eth(nft.price * line.qty)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="panel p-3">
              <h3 className="mb-2 font-bold">
                Carteira e rede
              </h3>

              {WALLETS.map(item => (
                <label
                  key={item}
                  className={`mb-1 flex cursor-pointer items-center gap-2 rounded border p-2 ${
                    wallet === item
                      ? "border-brand"
                      : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name="wallet"
                    checked={wallet === item}
                    onChange={() => setWallet(item)}
                    className="accent-brand"
                  />

                  {item}
                </label>
              ))}
            </div>

            <Summary
              subtotal={subtotal}
              fee={fee}
              total={total}
              action={
                <div>
                  {ErrorMessage}
                  <ConfirmButton />
                </div>
              }
            />
          </div>
        </div>
      </form>
    </>
  );
}