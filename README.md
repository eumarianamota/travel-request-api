# Travel Request API

## Equipe

| Integrante | Nome completo |
| --- | --- |
| 1 | Mariana da Mota Pinho |
| 2 | Willamy Josué Santos Serejo |


## Sobre o Projeto

O sistema permite que colaboradores de uma instituição pública registrem suas necessidades de deslocamento. A API valida regras de negócio essenciais, como o impedimento de viagens com saída em feriados nacionais (validado via integração com a BrasilAPI).

### Principais Funcionalidades:
*   Cadastro de Solicitações: Registro de viagens com validação de datas e impedimento em feriados nacionais.
*   Listagem e Consulta: Acesso aos dados das solicitações persistidas, no formato ISO 8601 (UTC).
*   Cancelamento: Alteração de status da solicitação para `canceled`.
*   Consulta de Feriados: Integração direta com a BrasilAPI para listagem e validação de feriados.


## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Vitest
- ESLint
- Prettier
- Yarn 4
- PostgreSQL

## SGBD escolhido

PostgreSQL.

## Gerenciador de pacotes

Yarn 4.

## Requisitos

- Node.js 24.15 ou superior
- Corepack habilitado
- PostgreSQL disponível localmente ou via Docker Compose

## Instalação das dependências

```bash
corepack enable
yarn install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```bash
NODE_ENV=development
APP_NAME=travel-request-api
APP_PORT=3030
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/travel_request_api
HOLIDAYS_API_BASE_URL=https://brasilapi.com.br
```

## Subir o SGBD com Docker Compose

Crie um arquivo `docker-compose.yml` na raiz do projeto com este conteúdo:

```yaml
services:
	postgres:
		image: postgres:16
		container_name: travel-request-postgres
		restart: unless-stopped
		environment:
			POSTGRES_USER: postgres
			POSTGRES_PASSWORD: postgres
			POSTGRES_DB: travel_request_api
		ports:
			- "5432:5432"
		volumes:
			- postgres_data:/var/lib/postgresql/data

volumes:
	postgres_data:
```

Depois, inicie o banco com:

```bash
docker compose up -d
```

## Inicialização e população do banco de dados

Com o PostgreSQL ativo, aplique o schema do projeto:

```bash
yarn db:schema
```

Esse comando cria as tabelas e índices usados pela aplicação. O repositório não possui um seed de dados de exemplo.

## Executar a aplicação

```bash
yarn dev
```

A API sobe, por padrão, em `http://localhost:3030`.

## Executar os testes

```bash
yarn test
```

Para uma validação mais ampla, também é possível executar:

```bash
yarn type:check
yarn lint
```

## Scripts disponíveis

- `yarn dev` - inicia a API em modo desenvolvimento
- `yarn db:schema` - aplica o schema no PostgreSQL configurado
- `yarn build` - gera a versão compilada em `build/`
- `yarn start` - executa a versão compilada
- `yarn type:check` - valida tipos com TypeScript
- `yarn lint` - executa o ESLint
- `yarn test` - executa os testes
- `yarn check` - executa formatação, lint, typecheck e testes

## Endpoints disponíveis

### POST /trip-requests

Cria uma nova solicitação de viagem.

Corpo da requisição:

```json
{
  "requesterName": "Maria Silva",
  "origin": "Parnaiba",
  "destination": "Teresina",
  "departureAt": "2026-06-24T10:00:00-03:00",
  "returnAt": "2026-06-24T18:00:00-03:00",
  "purpose": "Participation in an institutional meeting",
  "passengerCount": 3
}
```

### GET /trip-requests

Lista todas as solicitações de viagem cadastradas.

### GET /trip-requests/:id

Consulta uma solicitação específica pelo identificador.

### PATCH /trip-requests/:id/cancel

Cancela uma solicitação específica.

### GET /holidays/:year

Lista os feriados nacionais do ano informado.

Exemplo:

```bash
GET /holidays/2026
```

## Observações sobre as respostas

As rotas retornam respostas no formato:

```json
{
  "success": true,
  "data": {}
}
```