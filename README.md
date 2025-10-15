# Encurtador de Links

Este repositório contém dois projetos relacionados a um sistema simples de encurtador de URLs:

- **Frontend**: `my-app` — aplicação em Next.js (TypeScript / React) que fornece interface para criar e gerenciar links.
- **Backend**: `encurtador_link_back` — API em Node.js + Fastify que gerencia a criação, leitura, atualização, exclusão e redirecionamento de links. Usa **drizzle-orm** com PostgreSQL.

---

## Visão geral rápida

- O backend expõe uma API REST para gerenciar links e uma rota pública de redirecionamento para códigos curtos.
- O frontend consome a API (variável `NEXT_PUBLIC_API_URL`) e também constrói URLs curtas a partir de uma base configurável (`NEXT_PUBLIC_SHORT_BASE`).

---

## Aplicação em produção (links)

A seguir estão as instâncias hospedadas da aplicação:

- **Backend (API)**: [https://crud-mail.onrender.com/](https://crud-mail.onrender.com/)
- **Frontend (Next.js)**: [https://encurtador-link-phi.vercel.app/](https://encurtador-link-phi.vercel.app/)

> Use esses links para acessar a API e a interface já em produção/hospedadas.

---

## Estrutura do repositório

```
encurtador_link/           # frontend (my-app)
  └─ my-app/
     └─ src/app/           # código Next.js (TypeScript)

encurtador_link_back/      # backend (Fastify + Drizzle)
  └─ src/
     └─ modules/link/      # controller, service, repository, routes
     └─ infra/             # database + schema (Drizzle)
```

---

## Requisitos

- Node.js (versão moderna; projeto usa import ESM)
- PostgreSQL (para o backend)
- `npm` ou `pnpm` / `yarn`

---

## Backend — `encurtador_link_back`

### Instalação & execução

```bash
cd encurtador_link_back
npm install
# modo desenvolvimento (watch)
npm run dev
# modo produção
npm start
```

O servidor, por padrão, escuta na porta `3000` (variável `PORT` pode sobrescrever).

### Variáveis de ambiente

- `DATABASE_URL` — conexão do Postgres (obrigatório). Ex: `postgres://user:pass@localhost:5432/encurtador`
- `PORT` — porta HTTP (opcional, default `3000`).
- `CORS_ORIGIN` — (opcional) lista de origens separadas por vírgula para CORS. Ex: `http://localhost:3001`

Exemplo `.env`:

```
DATABASE_URL=postgres://postgres:senha@localhost:5432/encurtador_db
PORT=3000
CORS_ORIGIN=http://localhost:3001
```

> O backend usa `drizzle-orm` com `pg` (Pool). Veja `src/infra/database.js` para detalhes.

### Endpoints (API)

> **Base**: `http://<HOST>:<PORT>` — por padrão `http://localhost:3000`

- `GET  /links` — lista todos os links.
- `POST /links` — cria um novo link. Body JSON esperado: `{ "url": "https://exemplo.com", "legenda": "(opcional) título" }`. Retorna o registro criado.
- `PUT  /links/:id` — atualiza `url` e/ou `legenda` do link especificado.
- `DELETE /links/:id` — remove o link.
- `GET  /:code` — rota pública de redirecionamento. Quando chamada, o servidor incrementa `clicks` e responde com `302` para a URL original (campo `url`).

> Observações importantes:
> - O repositório garante unicidade de `url` e de `codigo` (slug curto). Ao criar, se a URL já existir, o backend retorna erro.
> - O código curto é gerado automaticamente (ex.: 6 caracteres alfanuméricos).

### Exemplo de criação (curl)

```bash
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","legenda":"Exemplo"}'
```

Resposta (exemplo):

```json
{
  "id": "...uuid...",
  "url": "https://example.com",
  "legenda": "Exemplo",
  "codigo": "Ab1cD2",
  "clicks": 0,
  "created_at": "2025-10-01T12:34:56.000Z"
}
```

### Redirecionamento

Se o código gerado for `Ab1cD2`, acessar `http://localhost:3000/Ab1cD2` retornará `302` com `Location: https://example.com` e incrementará `clicks`.

---

## Banco de dados (schema)

Tabela `links` (arquivo: `src/infra/db/schema.js`):

- `id` (uuid, PK)
- `url` (text, not null, unique)
- `legenda` (text, nullable)
- `codigo` (text, not null, unique) — slug curto
- `clicks` (integer, not null, default 0)
- `created_at` (timestamp, default now)

---

## Frontend — `my-app` (Next.js)

### Instalação & execução

```bash
cd encurtador_link/my-app
npm install
npm run dev
```

Por padrão o front roda em `http://localhost:3001` (script usa `-p 3001`).

### Variáveis de ambiente (frontend)

Crie um arquivo `.env.local` na raiz de `my-app` com as variáveis:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SHORT_BASE=http://localhost:3000
```

- `NEXT_PUBLIC_API_URL` — base usada para chamadas à API do backend. Algumas partes do frontend (componentes diferentes) constroem URLs como `${apiUrl}/api/links` ou `${apiUrl}/links` — ajuste `NEXT_PUBLIC_API_URL` conforme onde seu backend estiver exposto.
- `NEXT_PUBLIC_SHORT_BASE` — base usada para construir o *shortUrl* exibido para cada link. Se não definido, usa o `NEXT_PUBLIC_API_URL` por fallback.

> Observação: há pequenas diferenças em alguns componentes (por exemplo, um componente constrói `.../r/{code}` enquanto outros esperam `/ {code}` no backend). Para consistência, ajuste `NEXT_PUBLIC_SHORT_BASE` para o domínio/rota pública correta onde os códigos curtos serão resolvidos (por ex. `https://meu-dominio.com` ou `https://meu-dominio.com/r`).

### O que o frontend faz

- Página principal informativa.
- Página de criação (`/criar`) que chama a API para criar links.
- Painel de gerenciamento (`/painel-gerenciamento`) para listar, editar e apagar links.
- Copia/compartilha a URL curta construída a partir do `codigo` retornado pelo backend.

---

## Notas de desenvolvimento

- O serviço de geração de código (`LinkService`) usa `crypto.randomBytes` para criar slugs alfanuméricos de 6 caracteres e garante unicidade verificando o repositório.
- O backend foi construído com separação por camadas: `controller` -> `service` -> `repository`.
- Drizzle é usado para modelagem/queries no Postgres (`drizzle-orm`).

---

## Debug / Dicas

- Se o frontend mostrar `404` ao acessar um código curto, verifique:
  - Se a rota pública do backend é `/:code` (ex.: `http://localhost:3000/XYZ`) ou se você está usando um prefixo (ex.: `/r/XYZ`). Ajuste `NEXT_PUBLIC_SHORT_BASE` conforme necessário.
  - CORS: defina `CORS_ORIGIN` para o host do frontend (ex.: `http://localhost:3001`).

- Para logs do servidor Fastify, veja o console (o `fastify` foi inicializado com `logger: true`).

---


## Desenvolvedores

- Erick Alair
- Gabriel Vasco

---

