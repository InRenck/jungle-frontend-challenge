# Kurio

Base: kuriozip.zip, preservando catálogo de 9 NFTs, imagens, conteúdo e estrutura desktop. Incorporadas de kurio-atualizado.zip: navegação e busca mobile, filtros, ordenação, abas, paginação, ícones Lucide, login local, rotas protegidas de perfil e logout. Dependências sincronizadas.

```bash
npm ci
npm run dev
```

Build: `npm run build`.

Login é demonstrativo e local, sem autenticação em servidor. O catálogo original tem 9 NFTs, então a paginação só aparece quando houver mais de 9 resultados.

Para integrar: copie o conteúdo desta pasta para a pasta atual do projeto, substituindo os arquivos e preservando a pasta .git existente. Não inclui node_modules, dist ou histórico .git.
