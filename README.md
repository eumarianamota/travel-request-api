# TypeScript Setup

Template profissional para projetos **Node.js + TypeScript** com foco em:

- TypeScript estrito
- Node.js moderno com suporte nativo a TypeScript apagável
- ESM com `NodeNext`
- alias interno oficial via `package.json#imports`
- ESLint Flat Config
- Prettier
- Vitest
- Husky
- lint-staged
- validação de commit message
- integração com VS Code
- build para produção
- GitHub Actions
- suporte a Codex com `AGENTS.md`

## Objetivo

Este repositório fornece uma base reutilizável para projetos TypeScript com Node.js, organizada para oferecer:

- padronização de código
- validação automática de qualidade
- experiência consistente no VS Code
- pipeline simples para desenvolvimento, testes e build
- baixo acoplamento a ferramentas externas desnecessárias

## Requisitos

- Node.js **24.15+**
- Corepack habilitado
- Yarn **4+**

## Instalação

```bash
git clone git@github.com:uespi-setups/typescript.git
cd typescript
corepack enable
yarn install
```

## Feature ativa

O repositório agora inclui a primeira vertical slice da API de viagens:

- `POST /trip-requests`
- `GET /trip-requests`
- persistência em PostgreSQL com SQL direto
- validação local-first de feriados via BrasilAPI

Fluxo de preparação:

```bash
yarn db:schema
yarn dev
```

Detalhes operacionais em [docs/create-trip-request.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/docs/create-trip-request.md).
# Travel Request API

## Sobre o Projeto

O sistema permite que colaboradores de uma instituição pública registrem suas necessidades de deslocamento. A API valida regras de negócio essenciais, como o impedimento de viagens com saída em feriados nacionais (validado via integração com a BrasilAPI).

### Principais Funcionalidades:
*   Cadastro de Solicitações: Registro de viagens com validação de datas e impedimento em feriados nacionais.
*   Listagem e Consulta: Acesso aos dados das solicitações persistidas, no formato ISO 8601 (UTC).
*   Cancelamento: Alteração de status da solicitação para `canceled`.
*   Consulta de Feriados: Integração direta com a BrasilAPI para listagem e validação de feriados.

## Tecnologias uilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- Vitest
- ESLint
- Prettier
- Yarn 4

## Requisitos

- Node.js **24.15+**
- Corepack habilitado
- Yarn **4+**
- PostgreSQL acessível em `localhost:5432`

## Instalação

```bash
corepack enable
yarn install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com:

```bash
NODE_ENV=development
APP_NAME=travel-request-api
APP_PORT=3030
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/travel_request_api
HOLIDAYS_API_BASE_URL=https://brasilapi.com.br
```

## Banco de dados

Crie o banco `travel_request_api` no PostgreSQL e aplique o schema:

```bash
yarn db:schema
```

## Executar a aplicação

```bash
yarn dev
```

A API sobe, por padrão, em `http://localhost:3030`.

## Scripts disponíveis

- `yarn dev` - inicia a API em modo desenvolvimento
- `yarn db:schema` - aplica o schema no PostgreSQL configurado
- `yarn build` - gera a versão compilada em `build/`
- `yarn start` - executa a versão compilada
- `yarn type:check` - valida tipos com TypeScript
- `yarn lint` - executa o ESLint
- `yarn test` - executa os testes
- `yarn check` - executa formatação, lint, typecheck e testes

## Rotas

### Trip requests

- `POST /trip-requests`
- `GET /trip-requests`
- `GET /trip-requests/:id`
- `PATCH /trip-requests/:id/cancel`

### Feriados

- `GET /holidays/:year`

## Exemplo de uso

Criar uma solicitação:

```bash
curl -i \
	-X POST http://localhost:3030/trip-requests \
	-H "content-type: application/json" \
	-d '{
		"requesterName": "Maria Silva",
		"origin": "Parnaiba",
		"destination": "Teresina",
		"departureAt": "2026-06-24T10:00:00-03:00",
		"returnAt": "2026-06-24T18:00:00-03:00",
		"purpose": "Participation in an institutional meeting",
		"passengerCount": 3
	}'
```

Listar solicitações:

```bash
curl -i http://localhost:3030/trip-requests
```

Consultar feriados de um ano:

```bash
curl -i http://localhost:3030/holidays/2026
```

## Desenvolvimento

Os testes cobrem a configuração de ambiente, o bootstrap da aplicação e os fluxos principais da API. Se você quiser validar o projeto localmente, a ordem mais útil é:

```bash
yarn type:check
yarn test
yarn lint
```

## Documentação adicional

- [Guia de criação de solicitação de viagem](docs/create-trip-request.md)
- [Tutorial de uso local](docs/tutorial.md)