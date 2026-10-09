import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "./cart";
import { eth, IMG, type Nft } from "./data";

export function NftImg({
  id,
  className = "",
}: {
  id: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`aspect-square overflow-hidden rounded bg-gradient-to-br from-brand/70 to-line ${className}`}
    >
      {!failed && (
        <img
          src={IMG[id]}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function NftCard({ nft }: { nft: Nft }) {
  const { add } = useCart();
  return (
    <div className="panel relative p-2">
      {nft.rare && (
        <span className="absolute left-2 top-2 z-10 rounded-sm bg-brand px-1 font-bold text-bg">
          RARO
        </span>
      )}
      <Link to={`/nft/${nft.id}`}>
        <NftImg id={nft.id} />
      </Link>
      <p className="mt-2 truncate">{nft.name}</p>
      <div className="flex items-center justify-between">
        <p className="font-bold text-brand">
          {eth(nft.price)}{" "}
          {nft.oldPrice && (
            <s className="font-normal text-mute">{eth(nft.oldPrice)}</s>
          )}
        </p>
        <button
          className="cursor-pointer text-mute hover:text-brand"
          aria-label={`Adicionar ${nft.name} ao carrinho`}
          onClick={() => add(nft.id)}
        >
          + carrinho
        </button>
      </div>
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const fields =
    mode === "in"
      ? ["E-mail", "Senha"]
      : ["Nome de usuário", "E-mail", "Senha", "Confirmar senha"];
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="panel w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex gap-3 text-sm">
          <button
            className={mode === "in" ? "text-brand" : "text-mute"}
            onClick={() => setMode("in")}
          >
            Entrar
          </button>
          <button
            className={mode === "up" ? "text-brand" : "text-mute"}
            onClick={() => setMode("up")}
          >
            Criar conta
          </button>
          <button
            className="ml-auto text-mute"
            aria-label="Fechar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <p className="mb-3 text-mute">
          {mode === "in"
            ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
            : "Crie seu perfil de colecionador e conecte sua carteira quando quiser."}
        </p>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          {fields.map((f) => (
            <input
              key={f}
              required
              className="input"
              placeholder={f}
              type={
                f.includes("enha")
                  ? "password"
                  : f === "E-mail"
                    ? "email"
                    : "text"
              }
            />
          ))}
          {mode === "in" && (
            <a className="block text-right text-brand" href="#">
              Esqueceu a senha?
            </a>
          )}
          <button className="btn w-full">
            {mode === "in" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <p className="my-3 text-center text-mute">Ou continue com</p>
        <button className="btn-ghost mb-2 w-full">Continuar com Google</button>
        <button className="btn-ghost w-full">Continuar com Facebook</button>
      </div>
    </div>
  );
}

export function Layout() {
  const { count } = useCart();
  const [auth, setAuth] = useState(false);
  const link = ({ isActive }: { isActive: boolean }) =>
    `pb-1 ${isActive ? "border-b-2 border-brand text-brand" : "text-ink hover:text-brand"}`;
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-bold">
            KURIO
          </Link>
          <nav className="mx-auto hidden gap-6 md:flex">
            <NavLink to="/" end className={link}>
              Início
            </NavLink>
            <NavLink to="/carrinho" className={link}>
              Mercado
            </NavLink>
            <a href="#" className="pb-1">
              Criadores
            </a>
            <a href="#" className="pb-1">
              Aprenda
            </a>
          </nav>
          <Link
            to="/carrinho"
            className="ml-auto md:ml-0"
            aria-label="Carrinho"
          >
            Carrinho ({count})
          </Link>
          <Link to="/perfil">Meu perfil</Link>
          <button className="btn !px-3 !py-1" onClick={() => setAuth(true)}>
            Entrar
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      {auth && <AuthModal onClose={() => setAuth(false)} />}
    </>
  );
}

function Col({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 font-bold text-brand">{title}</h4>
      <ul className="space-y-1 text-mute">
        {items.map((i) => (
          <li key={i}>
            <a href="#">{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer(): ReactNode {
  return (
    <footer className="mt-10 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 md:grid-cols-4">
        <Col
          title="Meu perfil"
          items={[
            "Meu perfil",
            "Minha coleção",
            "Atividade",
            "Lista de interesse",
          ]}
        />
        <Col
          title="Central de ajuda"
          items={[
            "Central de ajuda",
            "Como comprar NFTs",
            "Carteira e segurança",
            "Denunciar item",
          ]}
        />
        <Col
          title="Coleções"
          items={["Arte digital", "Fotografia", "Música", "Arte 3D"]}
        />
        <div>
          <h4 className="mb-2 font-bold text-brand">
            Antecipe-se ao próximo lançamento
          </h4>
          <form className="flex gap-1" onSubmit={(e) => e.preventDefault()}>
            <input
              className="input"
              type="email"
              placeholder="digite seu e-mail..."
              aria-label="E-mail"
            />
            <button className="btn">Enviar</button>
          </form>
        </div>
      </div>
      <p className="border-t border-line py-3 text-center text-mute">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
