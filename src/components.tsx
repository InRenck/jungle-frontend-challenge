import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "./router-compat";
import {
  ArrowLeft, Compass, Eye, EyeOff, Facebook, Heart, Home as HomeIcon, Instagram, Linkedin, ScanLine, Wallet,
  LogIn, Search, ShoppingCart, Twitter, User, X, Youtube,
} from "lucide-react";
import { useCart } from "./cart";
import { useAuth } from "./auth";
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
          alt="" loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function NftCard({ nft }: { nft: Nft }) {
  const { add } = useCart();
  const [fav, setFav] = useState(false);
  return (
    <div className="panel nft-card relative p-2">
      {nft.rare && (
        <span className="absolute left-2 top-2 z-10 rounded-sm bg-brand px-1 font-bold text-bg">
          RARO
        </span>
      )}
      <Link to={`/nft/${nft.id}`}>
        <NftImg id={nft.id} />
      </Link>
      <button aria-label="Favoritar" aria-pressed={fav} onClick={() => setFav(f => !f)} className="card-favorite absolute right-3 top-3 rounded bg-bg/80 p-1 text-brand"><Heart size={14} className={fav ? "fill-brand" : ""} /></button>
      <p className="nft-name mt-2 truncate">{nft.name}</p>
      <div className="nft-price flex items-center justify-between">
        <p className="font-bold text-brand">
          {eth(nft.price)}{" "}
          {nft.oldPrice && (
            <s className="font-normal text-mute">{eth(nft.oldPrice)}</s>
          )}
        </p>
        <button
          className="card-add cursor-pointer text-mute hover:text-brand"
          aria-label={`Adicionar ${nft.name} ao carrinho`}
          onClick={() => add(nft.id)}
        >
          <ShoppingCart size={14} className="inline" /> carrinho
        </button>
      </div>
    </div>
  );
}

function SocialBtn({ children }: { children: ReactNode }) {
  return <button type="button" className="btn-ghost flex w-full items-center justify-center gap-2 !py-1.5 text-[11px]">{children}</button>;
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const fields = mode === "in" ? ["E-mail", "Senha"] : ["Nome de usuário", "E-mail", "Senha", "Confirmar senha"];

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (mode === "up" && f.get("Senha") !== f.get("Confirmar senha")) return setError("As senhas não conferem.");
    const email = String(f.get("E-mail"));
    login({ name: String(f.get("Nome de usuário") || email.split("@")[0]), email });
    onClose();
    nav("/perfil");
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="auth-dialog panel h-full w-full overflow-y-auto p-6 sm:h-auto sm:max-w-sm sm:p-5" onClick={e => e.stopPropagation()}>
        <div className="auth-heading mb-4 flex items-center gap-3 text-sm">
          <span className="auth-logo font-bold tracking-widest sm:hidden">KURIO</span>
          <div className="hidden gap-2 sm:flex">
            <button className={mode === "in" ? "text-brand" : "text-mute"} onClick={() => { setMode("in"); setError(""); }}>Entrar</button>
            <span className="text-line">|</span>
            <button className={mode === "up" ? "text-brand" : "text-mute"} onClick={() => { setMode("up"); setError(""); }}>Criar conta</button>
          </div>
          <button className="ml-auto text-mute hover:text-ink" aria-label="Fechar" onClick={onClose}><X size={16} /></button>
        </div>
        <h2 className="auth-title mb-2 text-center text-sm font-bold sm:hidden">{mode === "in" ? "Entrar" : "Criar perfil de colecionador"}</h2>
        <p className="auth-description mb-3 text-mute">
          {mode === "in" ? "Entre para gerenciar sua carteira, coleção e perfil de criador." : "Crie seu perfil de colecionador e conecte sua carteira quando quiser."}
        </p>
        <form className="auth-form space-y-2" onSubmit={submit}>
          {fields.map(f => {
            const pass = f.includes("enha");
            return (
              <div key={f} className="relative">
                <input required name={f} className="input" placeholder={f} type={pass ? (show ? "text" : "password") : f === "E-mail" ? "email" : "text"} />
                {pass && (
                  <button type="button" aria-label={show ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-mute hover:text-ink">
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            );
          })}
          {mode === "in" && <a className="block text-right text-brand" href="#">Esqueceu a senha?</a>}
          {error && <p role="alert" className="text-red-400">{error}</p>}
          <button className="auth-submit btn w-full">{mode === "in" ? "Entrar" : "Criar perfil"}</button>
        </form>
        <p className="auth-divider my-3 text-center text-mute">Ou continue com</p>
        <div className="space-y-2">
          <SocialBtn><span className="font-bold text-brand">G</span> Continuar com Google</SocialBtn>
          <SocialBtn><Facebook size={13} className="text-brand" /> Continuar com Facebook</SocialBtn>
        </div>
        <p className="auth-switch mt-4 text-center text-mute sm:hidden">
          {mode === "in" ? "Novo na Kurio? " : "Já tem uma conta? "}
          <button className="text-brand" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Crie uma conta" : "Entre"}</button>
        </p>
      </div>
    </div>
  );
}

const TITLES: Record<string, string> = { "/carrinho": "Carrinho de NFTs", "/pagamento": "Pagamento com carteira", "/confirmacao": "Pedido confirmado" };

export function Layout() {
  const { count } = useCart();
  const { user, authOpen, openAuth, closeAuth } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const isHome = pathname === "/";
  const isDetail = pathname.startsWith("/nft/");
  const showBottom = isHome || pathname.startsWith("/perfil");
  const link = ({ isActive }: { isActive: boolean }) => `pb-1 ${isActive ? "border-b-2 border-brand text-brand" : "text-ink hover:text-brand"}`;
  const bottom = ({ isActive }: { isActive: boolean }) => `grid h-10 w-10 place-items-center ${isActive ? "text-brand" : "text-mute"}`;
  const badge = count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-bg">{count}</span>;

  return (
    <>
      <header className="hidden border-b border-line md:block">
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
          <button className="btn !px-3 !py-1" onClick={() => user ? nav("/perfil") : openAuth()}>
            <LogIn size={13} className="inline" /> {user ? user.name : "Entrar"}
          </button>
        </div>
      </header>

      {!isHome && !isDetail && (
        <div className="mobile-top flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
          <button aria-label="Voltar" onClick={() => nav(-1)} className="grid h-7 w-7 place-items-center rounded-full border border-line"><ArrowLeft size={14} /></button>
          <span className="flex-1 text-center font-bold">{TITLES[pathname] ?? "KURIO"}</span>
          <span className="w-7" />
        </div>
      )}

      <main className={`mobile-main mx-auto max-w-6xl px-4 py-5 md:py-6 md:pb-6 ${showBottom ? "mobile-with-nav" : ""}`}><Outlet /></main>
      <Footer />

      {showBottom && <nav aria-label="Navegação principal" className="mobile-bottom fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-line bg-panel px-4 py-2 md:hidden">
        <NavLink to="/" end aria-label="Início" className={bottom}><HomeIcon size={18} /></NavLink>
        <NavLink to="/perfil/carteiras" aria-label="Carteiras" className={bottom}><Heart size={18} fill="currentColor" /></NavLink>
        <Link to="/#explorar" aria-label="Explorar" className="-mt-6 grid h-12 w-12 place-items-center rounded-full border-4 border-bg bg-brand text-bg"><ScanLine size={20} /></Link>
        <NavLink to="/carrinho" aria-label="Carrinho" className={bottom}><span className="relative"><ShoppingCart size={18} />{badge}</span></NavLink>
        {user ? <NavLink to="/perfil" aria-label="Meu perfil" className={bottom}><User size={18} /></NavLink> : <button aria-label="Entrar" onClick={openAuth} className="grid h-10 w-10 place-items-center text-mute"><User size={18} /></button>}
      </nav>}

      {authOpen && <AuthModal onClose={closeAuth} />}
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
  const groups = [
    {
      title: "Meu perfil",
      items: [
        "Meu perfil",
        "Minha coleção",
        "Atividade",
        "Estúdio do criador",
        "Lista de interesse",
      ],
    },
    {
      title: "Central de ajuda",
      items: [
        "Central de ajuda",
        "Como comprar NFTs",
        "Carteira e segurança",
        "Política do mercado",
        "Denunciar item",
      ],
    },
    {
      title: "Coleções",
      items: [
        "Arte digital",
        "Fotografia",
        "Música",
        "Arte 3D",
        "Utilidade",
      ],
    },
  ];

  const features = [
    {
      icon: "W",
      title: "Segurança da carteira",
      text: "Proteja sua carteira e colecione arte digital verificada com confiança.",
    },
    {
      icon: "C",
      title: "Criadores em destaque",
      text: "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
    },
    {
      icon: "D",
      title: "Alertas de lançamentos",
      text: "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
    },
  ];

  return (
    <footer className="site-footer mt-12 border-t border-line bg-panel pb-16 md:pb-0">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 border-b border-line py-6 md:grid-cols-4">
          {features.map(feature => (
            <div
              key={feature.title}
              className="md:border-r md:border-line md:pr-4"
            >
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand font-bold text-bg">
                {feature.icon}
              </div>
              <h3 className="font-bold">{feature.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-mute">
                {feature.text}
              </p>
            </div>
          ))}

          <div>
            <h3 className="mb-3 font-bold">
              Antecipe-se ao próximo lançamento
            </h3>
            <form
              onSubmit={event => {
                event.preventDefault();
                const form = event.currentTarget;
                const input = form.elements.namedItem("newsletter-email");
                if (input instanceof HTMLInputElement) {
                  input.value = "";
                }
              }}
              className="flex overflow-hidden rounded border border-line"
            >
              <input
                name="newsletter-email"
                required
                type="email"
                placeholder="digite seu e-mail..."
                aria-label="E-mail para novidades"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs outline-none"
              />
              <button type="submit" className="bg-brand px-3 font-bold text-bg">
                Enviar
              </button>
            </form>
            <p className="mt-3 text-xs text-mute">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-b border-line py-5 text-xs sm:grid-cols-2 md:grid-cols-4">
          <strong className="tracking-widest">KURIO</strong>
          <p className="text-mute">
            Feito para colecionadores, criadores e cultura.
          </p>
          <p className="text-mute">contato@email.com</p>
          <p className="text-mute">Entre em contato pelos nossos canais.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          {groups.map(group => (
            <div key={group.title}>
              <h3 className="mb-3 font-bold">{group.title}</h3>
              <ul className="space-y-2 text-xs text-mute">
                {group.items.map(item => (
                  <li key={item}>
                    <a href="#explorar" className="hover:text-brand">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-3 font-bold">Redes sociais</h3>
            <div className="flex flex-wrap gap-2">
              {["f", "◎", "𝕏", "in", "▶"].map(social => (
                <span
                  key={social}
                  className="grid h-7 w-7 place-items-center rounded border border-brand text-xs font-bold text-brand"
                  aria-hidden="true"
                >
                  {social}
                </span>
              ))}
            </div>

            <h3 className="mb-3 mt-6 font-bold">
              Carteiras compatíveis
            </h3>
            <p className="text-xs font-bold text-brand">
              METAMASK · WALLETCONNECT · COINBASE
            </p>
          </div>
        </div>
      </div>

      <p className="border-t border-line py-4 text-center text-xs text-mute">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
