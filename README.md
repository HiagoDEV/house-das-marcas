# House das Marcas — loja online

Site da loja (catalogo publico) + painel do lojista, construidos com Next.js 16, Prisma e PostgreSQL.

## Rodando localmente

Pre-requisitos: Node 20+, PostgreSQL rodando localmente (ja configurado neste projeto).

```bash
npm install
npm run dev
```

Acesse:

- Loja: http://localhost:3000
- Painel do lojista: http://localhost:3000/admin/login

Login padrao do painel (criado pelo seed):

- E-mail: `admin@housedasmarcas.com.br`
- Senha: `admin123`

**Troque essa senha antes de colocar o site no ar.**

## Banco de dados

O schema fica em `prisma/schema.prisma`. Depois de alterar o schema:

```bash
npx prisma migrate dev --name descricao_da_mudanca
```

Para repovoar os dados de exemplo (categorias, produtos e o admin):

```bash
npm run db:seed
```

Para visualizar/editar os dados direto no banco:

```bash
npm run db:studio
```

## O que ja esta pronto

- Painel do lojista (`/admin`): login, dashboard, cadastro/edicao/exclusao de produtos (com upload de fotos), categorias e visualizacao de pedidos.
- Loja publica (`/`, `/produtos`): vitrine com os produtos cadastrados no painel, filtro por categoria e pagina de detalhe.
- Fotos de produto sao salvas em `public/uploads/products` (arquivos locais, sem dependencia externa).

## O que falta (proximos passos)

- **Checkout e pagamento**: hoje a loja so exibe os produtos. Falta a pagina de carrinho/checkout e a integracao com o Mercado Pago (ja ha um `.env` preparado com as variaveis `MERCADOPAGO_ACCESS_TOKEN` e `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` para quando formos fazer essa parte).
- Cadastro de fotos do Instagram da loja (os produtos de exemplo sao fake, preparados so para demonstrar o painel).

## Variaveis de ambiente

Veja `.env.example`. O arquivo `.env` real (com senha do banco e chaves) nao vai para o git.
