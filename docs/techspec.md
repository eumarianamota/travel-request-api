# Especificação Técnica

## Resumo Executivo

A solução será uma API REST em TypeScript com `express`, PostgreSQL 17 via Docker Compose e SQL direto. O código será organizado por feature, com `domain`, `application` e `infra`.

A validação de feriados seguirá estratégia local-first: a aplicação consulta primeiro a tabela `holidays` e usa a BrasilAPI apenas quando o ano solicitado ainda não existir localmente. Os dados obtidos externamente serão persistidos para reutilização.

## Arquitetura do Sistema

### Visão Geral dos Componentes

- `trip-requests/domain`: regras da solicitação de viagem
- `trip-requests/application`: criar, listar, consultar por id e cancelar
- `trip-requests/infra`: rotas, controllers e repositório SQL
- `holidays/application`: consulta por ano e sincronização sob demanda
- `holidays/infra`: cliente da BrasilAPI e repositório SQL
- `shared/infra/http`: bootstrap do `express` e middleware de erro
- `shared/config`: leitura de variáveis de ambiente

Fluxo principal:

1. Controller recebe a requisição
2. Caso de uso valida regras de negócio
3. Para feriados, consulta primeiro a base local
4. Se o ano não existir localmente, consulta a BrasilAPI e persiste os dados
5. Repositório persiste ou consulta `trip_requests`
6. Resposta é serializada no padrão definido no PRD

## Design de Implementação

### Interfaces Principais

```ts
export interface TripRequestRepository {
  create(input: CreateTripRequestRecord): Promise<TripRequestRecord>
  findAll(): Promise<TripRequestRecord[]>
  findById(id: number): Promise<TripRequestRecord | null>
  updateStatus(id: number, status: TripRequestStatus): Promise<TripRequestRecord>
}
```

```ts
export interface HolidayRepository {
  findByYear(year: number): Promise<HolidayRecord[]>
  replaceYear(year: number, holidays: HolidayRecord[]): Promise<void>
}
```

```ts
export interface HolidaysGateway {
  fetchByYear(year: number): Promise<HolidayRecord[]>
}
```

### Modelos de Dados

Entidades:

- `TripRequest`: `id`, `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, `passengerCount`, `status`, `createdAt`
- `Holiday`: `date`, `name`, `type`, `year`

Tabelas:

- `trip_requests`
  - `id` integer primary key generated always as identity
  - `requester_name` text not null
  - `origin` text not null
  - `destination` text not null
  - `departure_at` timestamptz not null
  - `return_at` timestamptz not null
  - `purpose` text not null
  - `passenger_count` integer not null
  - `status` text not null
  - `created_at` timestamptz not null

- `holidays`
  - `date` date not null
  - `name` text not null
  - `type` text not null
  - `year` integer not null
  - unique `(year, date)`

Restrições recomendadas:

- `passenger_count > 0`
- `status IN ('pending', 'canceled')`
- índice em `departure_at`
- índice em `year`

### Endpoints de API

- `POST /trip-requests`: cria solicitação
- `GET /trip-requests`: lista solicitações
- `GET /trip-requests/:id`: consulta por id
- `PATCH /trip-requests/:id/cancel`: cancela solicitação
- `GET /holidays/:year`: consulta feriados do ano

## Pontos de Integração

- BrasilAPI
  - Base URL: `HOLIDAYS_API_BASE_URL`
  - Endpoint: `GET /api/feriados/v1/:year`
  - Sem autenticação
  - Falha externa só bloqueia o fluxo quando a aplicação realmente precisar consultar o ano ausente localmente

## Abordagem de Testes

### Testes Unitários

Cobrir:

- validação de campos obrigatórios
- `origin !== destination`
- `returnAt >= departureAt`
- `passengerCount` inteiro positivo
- normalização de datas
- cancelamento de solicitação já cancelada
- serviço de feriados local-first

Mocks:

- gateway da BrasilAPI
- repositórios nos testes da camada `application`

### Testes de Integração

Cobrir:

- rotas HTTP + casos de uso + PostgreSQL
- criação válida
- bloqueio por feriado
- consulta inexistente
- cancelamento válido
- cancelamento já cancelado
- carregamento de feriados do ano ausente via BrasilAPI fake/stub

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Configuração de ambiente, `express` e conexão com PostgreSQL
2. Estrutura SQL de `trip_requests` e `holidays`
3. Repositórios SQL
4. Serviço de feriados com estratégia local-first
5. Caso de uso de criação
6. Casos de uso de listagem, consulta por id e cancelamento
7. Endpoint `GET /holidays/:year`
8. Middleware de erros e testes

### Dependências Técnicas

- PostgreSQL 17 via Docker Compose
- `DATABASE_URL`
- `HOLIDAYS_API_BASE_URL`

## Monitoramento e Observabilidade

- Logs mínimos:
  - `info`: bootstrap, criação, cancelamento, sincronização de feriados
  - `warn`: validação inválida, não encontrado, cancelamento inválido
  - `error`: falha inesperada, falha no banco, falha obrigatória na BrasilAPI

- Métricas e dashboards não serão implementados nesta versão

## Considerações Técnicas

### Decisões Principais

- Organização por feature para manter baixo acoplamento
- PostgreSQL 17 com SQL direto para manter a solução simples
- Estratégia local-first para reduzir dependência da BrasilAPI
- `pending` e `canceled` como únicos estados observáveis

### Riscos Conhecidos

- Primeira consulta de um ano ausente depende da BrasilAPI
- Mapeamento SQL manual aumenta risco de erro de persistência
- Divergência entre o enunciado original e a decisão de produto sobre status inicial

### Conformidade com Padrões

- Padrões aplicados:
  - organização por feature
  - `camelCase`, `PascalCase` e `kebab-case`
  - código e mensagens internas em inglês
  - TypeScript estrito
  - Vitest
  - Yarn

### Arquivos relevantes

- [docs/prd-template.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/docs/prd-template.md)
- [docs/techspec-template.md](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/docs/techspec-template.md)
- [package.json](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/package.json)
- [src/main.ts](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/src/main.ts)
- [src/config/env.ts](/home/mariana/Documentos/CSTSC/20261/PBK/travel-request-api/src/config/env.ts)
