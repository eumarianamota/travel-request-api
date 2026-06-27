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
