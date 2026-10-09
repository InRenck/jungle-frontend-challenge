import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";

const MENU: [string, string][] = [
  ["Dados do perfil", "/perfil"],
  ["Carteiras", "/perfil/carteiras"],
  ["Atividade", "#"],
  ["Lista de interesse", "#"],
  ["Ofertas", "#"],
  ["Arquivos baixados", "#"],
  ["Suporte", "#"],
];

export function ProfileLayout() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `block border-l-2 px-3 py-2 ${isActive ? "border-brand text-brand" : "border-transparent text-mute hover:text-ink"}`;
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside className="panel h-fit p-2">
        <h2 className="mb-2 px-3 font-bold">Meu perfil</h2>
        <nav>
          {MENU.map(([label, to]) =>
            to === "#" ? (
              <a
                key={label}
                href="#"
                className="block border-l-2 border-transparent px-3 py-2 text-mute hover:text-ink"
              >
                {label}
              </a>
            ) : (
              <NavLink key={label} to={to} end className={cls}>
                {label}
              </NavLink>
            ),
          )}
          <NavLink
            to="/"
            className="mt-2 block border-t border-line px-3 py-2 text-brand"
          >
            Sair
          </NavLink>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
}

function Field({
  label,
  children,
  required = true,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      {label} {required && <span className="text-brand">*</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function ProfileData() {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("nova") !== f.get("confirmar"))
      return setError(
        "As senhas não conferem. Digite a mesma senha nos dois campos.",
      );
    setError("");
    setSaved(true);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="font-bold">Perfil do colecionador</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nome de exibição">
          <input required className="input" />
        </Field>
        <Field label="Nome de usuário">
          <input required className="input" />
        </Field>
        <Field label="E-mail">
          <input required type="email" className="input" />
        </Field>
        <Field label="Nome ENS">
          <div className="flex gap-1">
            <span className="input !w-14 text-center">.eth</span>
            <input required className="input" />
          </div>
        </Field>
        <Field label="Apelido da carteira">
          <input required className="input" />
        </Field>
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-line">
            🙂
          </span>
          <button type="button" className="btn !py-1">
            Alterar
          </button>
          <button type="button" className="text-mute hover:text-ink">
            Remover
          </button>
        </div>
      </div>

      <div className="max-w-sm space-y-3">
        <h2 className="font-bold">Alterar senha</h2>
        <Field label="Senha atual" required={false}>
          <input name="atual" type="password" className="input" />
        </Field>
        <Field label="Nova senha" required={false}>
          <input name="nova" type="password" className="input" />
        </Field>
        <Field label="Confirmar nova senha" required={false}>
          <input name="confirmar" type="password" className="input" />
        </Field>
      </div>

      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-brand">
          Perfil salvo.
        </p>
      )}
      <button className="btn">Salvar</button>
    </form>
  );
}

function WalletForm({ onSave }: { onSave: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nome de exibição">
          <input required className="input" />
        </Field>
        <Field label="Apelido da carteira">
          <input required className="input" />
        </Field>
        <Field label="Rede">
          <select required className="input" defaultValue="">
            <option value="" disabled>
              Selecione uma rede
            </option>
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>Solana</option>
          </select>
        </Field>
        <Field label="Nome do perfil">
          <input required className="input" />
        </Field>
        <Field label="Endereço da carteira">
          <input
            required
            className="input"
            placeholder="Endereço 0x da carteira"
          />
        </Field>
        <Field label="ENS ou carteira secundária (opcional)" required={false}>
          <input className="input" />
        </Field>
        <Field label="Tipo de carteira">
          <select required className="input" defaultValue="">
            <option value="" disabled>
              Selecione uma carteira
            </option>
            <option>MetaMask</option>
            <option>WalletConnect</option>
            <option>Coinbase Wallet</option>
          </select>
        </Field>
        <Field label="Código de indicação">
          <input required className="input" />
        </Field>
        <Field label="E-mail">
          <input required type="email" className="input" />
        </Field>
        <Field label="Nome ENS">
          <div className="flex gap-1">
            <span className="input !w-14 text-center">.eth</span>
            <input required className="input" />
          </div>
        </Field>
      </div>
      <button className="btn">Salvar carteira</button>
    </form>
  );
}

export function Wallets() {
  const [msg, setMsg] = useState("");
  const [second, setSecond] = useState(false);
  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-bold">Carteira principal</h1>
        <p className="mb-3 text-mute">
          Estas carteiras ficam disponíveis no pagamento e para receber NFTs
          comprados.
        </p>
        <WalletForm onSave={() => setMsg("Carteira principal salva.")} />
      </section>
      <section className="border-t border-line pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Carteira secundária</h2>
          <button className="text-brand" onClick={() => setSecond((s) => !s)}>
            {second ? "Cancelar" : "Adicionar"}
          </button>
        </div>
        {second ? (
          <div className="mt-3">
            <WalletForm
              onSave={() => {
                setSecond(false);
                setMsg("Carteira secundária salva.");
              }}
            />
          </div>
        ) : (
          <p className="mt-1 text-mute">
            Você ainda não adicionou uma carteira secundária.
          </p>
        )}
      </section>
      {msg && (
        <p role="status" className="text-brand">
          {msg}
        </p>
      )}
    </div>
  );
}
