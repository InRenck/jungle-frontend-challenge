Kurio — NFT Marketplace

Este projeto foi desenvolvido como parte do desafio técnico para a vaga de Frontend Developer na Jungle Gaming.

O objetivo do desafio foi reproduzir a interface de um marketplace de NFTs a partir do design e das orientações fornecidas.

Durante o desenvolvimento, procurei seguir a referência visual e implementar as funcionalidades solicitadas, buscando manter a aplicação responsiva e com uma navegação simples.

🌐 Aplicação

O projeto está disponível na Vercel:

Acessar o Kurio

✨ Funcionalidades

O projeto conta com:

* Catálogo de NFTs com busca, filtros e ordenação.
* Página de detalhes dos NFTs.
* Carrinho de compras com persistência local.
* Simulação de checkout e confirmação de pedido.
* Área de perfil e carteiras.
* Layout responsivo para diferentes tamanhos de tela.

🛠️ Tecnologias utilizadas

* React
* TypeScript
* Vite
* Tailwind CSS
* TanStack Router
* TanStack Query
* Axios
* Mock Service Worker (MSW)
* Playwright

💻 Como executar

Clone o repositório:

git clone https://github.com/InRenck/jungle-frontend-challenge.git

Acesse a pasta do projeto:

cd jungle-frontend-challenge

Instale as dependências:

npm install

Inicie a aplicação:

npm run dev

O endereço para acessar o projeto será exibido no terminal.

🧪 Testes

Foram adicionados testes automatizados com Playwright para verificar alguns dos fluxos da aplicação.

Para executar:

npx playwright install chromium
npx playwright test

Para gerar o build de produção:

npm run build

📌 Observações

A aplicação utiliza o MSW para simular as respostas da API, sem depender de um backend externo.

O processo de checkout é demonstrativo e não realiza pagamentos ou transações reais.

Sobre o projeto

O desenvolvimento foi realizado com base no material disponibilizado para o desafio técnico, buscando atender aos requisitos propostos e reproduzir a interface apresentada.

⸻

Inghara Renck
Desafio técnico — Jungle Gaming