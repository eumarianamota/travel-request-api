### Tutorial para acessar a API

Se você quer só colocar a API para rodar localmente com PostgreSQL, faz assim.

1. Verifique se o PostgreSQL está instalado

psql --version

Se aparecer a versão, ele está instalado.
Se não aparecer, instale:

sudo apt update
sudo apt install postgresql postgresql-contrib

2. Suba o serviço do PostgreSQL

sudo systemctl start postgresql

Para confirmar:

systemctl is-active postgresql

Se responder active, está ok.

Se quiser deixar iniciando sozinho no boot:

sudo systemctl enable postgresql

3. Entre no PostgreSQL como usuário administrador

sudo -u postgres psql

Se abrir um prompt assim:

postgres=#

está certo.

4. Defina a senha do usuário postgres

A sua API usa esta conexão por padrão:

postgresql://postgres:postgres@localhost:5432/travel_request_api

Então, dentro do psql, rode:

ALTER USER postgres WITH PASSWORD 'postgres';

5. Crie o banco da aplicação

Ainda dentro do psql:

CREATE DATABASE travel_request_api;

Se disser que já existe, tudo bem.

6. Confira se o banco foi criado

Ainda dentro do psql:

\l

Procure por travel_request_api.

7. Saia do psql

\q

8. Teste a conexão com o banco

psql postgresql://postgres:postgres@localhost:5432/travel_request_api

Se entrar no psql, está funcionando.
Saia com:

\q

9. Crie o arquivo .env na raiz do projeto

Na pasta do projeto, crie um .env com isso:

NODE_ENV=development
APP_NAME=travel-request-api
APP_PORT=3030
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/travel_request_api
HOLIDAYS_API_BASE_URL=https://brasilapi.com.br

10. Prepare o schema do banco

Na raiz do projeto:

yarn db:schema

Isso cria as tabelas.

11. Suba a API

yarn dev

Se estiver tudo certo, ela vai subir em:

http://localhost:3030

12. Faça um teste simples

Listar viagens:

curl -i http://localhost:3030/trip-requests

Criar uma solicitação:

curl -i \
 -X POST http://localhost:3030/trip-requests \
 -H 'content-type: application/json' \
 -d '{
"requesterName": "Maria Silva",
"origin": "Parnaiba",
"destination": "Teresina",
"departureAt": "2026-06-24T10:00:00-03:00",
"returnAt": "2026-06-24T18:00:00-03:00",
"purpose": "Participation in an institutional meeting",
"passengerCount": 3
}'

Cancelar a solicitação 1:

curl -i -X PATCH http://localhost:3030/trip-requests/1/cancel

Resumo rápido

Sempre que quiser testar localmente:

sudo systemctl start postgresql
yarn db:schema
yarn dev

Se quiser, eu posso fazer o próximo passo e te passar um roteiro de testes manuais, em ordem, com o resultado esperado de cada curl.

### postgree acessar

1. Abrir o terminal e entrar no PostgreSQL

Rode:

sudo -u postgres psql

Se der certo, vai aparecer algo parecido com:

postgres=#

2. Trocar a senha do usuário postgres

Depois que aparecer esse postgres=#, cole esta linha e aperte Enter:

ALTER USER postgres WITH PASSWORD 'postgres';

Se funcionar, o PostgreSQL responde algo como:

ALTER ROLE

3. Criar o banco que a API vai usar

Ainda nessa mesma tela, rode:

CREATE DATABASE travel_request_api;

Se funcionar, ele responde algo como:

CREATE DATABASE

4. Sair do PostgreSQL

Digite:

\q

5. Testar se a conexão funciona

Agora rode no terminal:

psql postgresql://postgres:postgres@localhost:5432/travel_request_api

Se entrar no PostgreSQL, deu certo. Vai aparecer de novo algo como:

travel_request_api=#

Depois saia com:

\q

O que isso fez

Você configurou:

- usuário: postgres
- senha: postgres
- banco: travel_request_api

Isso bate com a configuração que a API espera.

Se quiser copiar e fazer sem pensar muito, é isso:

sudo -u postgres psql

Depois, dentro do psql:

ALTER USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE travel_request_api;
\q

Depois, no terminal:

psql postgresql://postgres:postgres@localhost:5432/travel_request_api

Se quiser, você pode me mandar exatamente o que apareceu quando rodou sudo -u postgres psql e eu te guio linha por linha.

### Rodar na API

Use curl com POST.

No terminal, rode:

curl -i \
 -X POST http://localhost:3030/trip-requests \
 -H 'content-type: application/json' \
 -d '{
"requesterName": "Maria Silva",
"origin": "Parnaiba",
"destination": "Teresina",
"departureAt": "2026-06-24T10:00:00-03:00",
"returnAt": "2026-06-24T18:00:00-03:00",
"purpose": "Participation in an institutional meeting",
"passengerCount": 3
}'

Se der certo, deve voltar algo como:

{
"success": true,
"data": {
"id": 1,
"requesterName": "Maria Silva",
"origin": "Parnaiba",
"destination": "Teresina",
"departureAt": "...",
"returnAt": "...",
"purpose": "Participation in an institutional meeting",
"passengerCount": 3,
"status": "pending",
"createdAt": "..."
}
}

Depois, para ver a lista:

curl -i http://localhost:3030/trip-requests

Para buscar a que você criou:

curl -i http://localhost:3030/trip-requests/1

Para cancelar:

curl -i -X PATCH http://localhost:3030/trip-requests/1/cancel

Se quiser, eu posso te passar uma versão desse curl toda em uma linha, que às vezes é mais fácil de colar no terminal.
