import { NftImg } from "../components";

const articles = [
  {
    id: 2,
    date: "12 de setembro",
    read: "6 min",
    title: "Como funciona a propriedade de NFTs",
    description: "Aprenda a colecionar, negociar e verificar ativos digitais.",
  },
  {
    id: 1,
    date: "13 de setembro",
    read: "2 min",
    title: "10 artistas digitais para acompanhar",
    description: "Conheça criadores que moldam a cultura digital.",
  },
  {
    id: 3,
    date: "15 de setembro",
    read: "3 min",
    title: "Raridade, atributos e procedência",
    description: "Entenda raridade, procedência, direitos autorais e utilidade.",
  },
  {
    id: 4,
    date: "15 de setembro",
    read: "2 min",
    title: "Como proteger sua carteira",
    description: "Proteja sua carteira, seus ativos e sua identidade.",
  },
];

export function HomeExtras() {
  return (
    <div className="mt-12 space-y-12">
      <section
        aria-label="Coleções em destaque"
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="grid grid-cols-2 overflow-hidden rounded bg-panel">
          <NftImg id={1} className="h-full w-full" />
          <div className="flex flex-col items-end justify-center p-4 text-right">
            <h2 className="text-sm font-bold">
              Lançamentos gênesis de edição limitada
            </h2>
            <p className="mt-2 text-xs text-mute">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
            <a href="#explorar" className="btn mt-3 inline-block">
              Explorar →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded bg-panel">
          <NftImg id={2} className="h-full w-full" />
          <div className="flex flex-col items-end justify-center p-4 text-right">
            <h2 className="text-sm font-bold">
              Arte digital selecionada e muito mais
            </h2>
            <p className="mt-2 text-xs text-mute">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
            <a href="#explorar" className="btn mt-3 inline-block">
              Explorar →
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="diario-title">
        <div className="mb-6 text-center">
          <h2 id="diario-title" className="text-xl font-bold">
            Diário da Cunhagem
          </h2>
          <p className="mt-2 text-xs text-mute">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {articles.map(article => (
            <article
              key={article.title}
              className="overflow-hidden rounded bg-panel"
            >
              <NftImg id={article.id} className="w-full" />
              <div className="space-y-2 p-3">
                <p className="text-[10px] text-mute">
                  {article.date} | Leitura de {article.read}
                </p>
                <h3 className="text-sm font-bold leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-mute">
                  {article.description}
                </p>
                <a
                  href="#explorar"
                  className="inline-block text-xs font-bold text-brand"
                >
                  Ler mais →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}