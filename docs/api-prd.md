# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

Uma aplicação backend para gerenciamento de solicitações de viagem institucional. O problema principal que a API resolve é a inexistência de um meio funcional e centralizado para solicitar viagens.

A solução deverá permitir que solicitações de viagem sejam criadas, visualizadas e canceladas por meio da própria API. Os usuários principais são os membros da equipe interna da instituição responsáveis por registrar uma solicitação de viagem, consultar viagens já cadastradas e cancelar uma solicitação específica já criada.

O valor de negócio da solução é centralizar o processo de cadastro de viagens em um único sistema interno, tornando o processo mais organizado para a instituição.

## Objetivos

- Permitir o cadastro, a consulta e o cancelamento de solicitações de viagens
- Validar regras básicas
- Consultar uma API externa de feriados nacionais.

Cada solicitação de viagem deverá possuir, no mínimo, os seguintes campos:

- id : identificador único da solicitação;
- requesterName : nome do solicitante;
- origin : cidade de origem;
- destination : cidade de destino;
- departureAt : data e hora previstas de saída;
- returnAt : data e hora previstas de retorno;
- purpose : justificativa ou finalidade da viagem;
- passengerCount : quantidade de passageiros;
- status : situação atual da solicitação;
- createdAt : data e hora de criação do registro.

O campo `id` será gerado automaticamente pelo banco de dados por meio de autoincremento.

Os campos da solicitação estão definidos e não fazem parte do escopo alterações na versão atual do produto.

O produto será considerado bem-sucedido se permitir o cadastro de solicitações de viagem com os campos obrigatórios definidos, a consulta das solicitações cadastradas e o cancelamento de uma solicitação específica já criada, respeitando as regras de negócio estabelecidas.

As datas deverão ser recebidas, armazenadas no banco de dados e retornadas pela API em formato ISO 8601 completo, como texto, utilizando o padrão UTC com sufixo `Z`, no formato `YYYY-MM-DDTHH:mm:ss.sssZ`.

Exemplo:

- `2026-06-24T10:00:00.000Z`

Assim, os campos `departureAt`, `returnAt` e `createdAt` deverão seguir esse formato.

Caso a API receba uma data válida em outro formato ISO 8601 aceito pelo JavaScript, a aplicação deverá normalizar o valor antes de persistir, utilizando o formato UTC com `Z`.

Exemplo:

- entrada: `2026-06-24T07:00:00-03:00`
- valor armazenado: `2026-06-24T10:00:00.000Z`

Para fins de verificação de feriado nacional, deverá ser considerada a data civil extraída do campo `departureAt` já normalizado, no formato `YYYY-MM-DD`.

Objetivos de negócio:

- Centralizar todos os cadastros de viagem nessa API

Regras obrigatórias que suportam os objetivos do produto:

- A data de retorno (`returnAt`) deverá ser posterior ou igual à data de saída (`departureAt`)
- A quantidade de passageiros (`passengerCount`) deverá ser maior que zero
- A data de saída (`departureAt`) não poderá corresponder a um feriado nacional
- A verificação de feriado deverá utilizar dados obtidos da BrasilAPI, preferencialmente armazenados e reutilizados localmente pela aplicação
- Uma solicitação inexistente deverá retornar erro padronizado
- Uma solicitação já cancelada não poderá ser cancelada novamente
- Quando a aplicação precisar consultar a API externa de feriados e ela estiver indisponível ou retornar erro, a solicitação não deverá ser criada

## Histórias de Usuário

Perfil de usuário:

- Equipe interna da instituição com acesso à API

Permissões:

- Todos os usuários possuem as mesmas permissões
- Qualquer usuário com acesso à API pode criar uma solicitação de viagem
- Qualquer usuário com acesso à API pode visualizar qualquer solicitação cadastrada
- Qualquer usuário com acesso à API pode cancelar qualquer solicitação cadastrada

Histórias principais:

- Como membro da equipe interna da instituição, eu quero criar uma solicitação de viagem para registrar uma necessidade de deslocamento institucional
- Como membro da equipe interna da instituição, eu quero listar as solicitações de viagem para consultar os registros já cadastrados
- Como membro da equipe interna da instituição, eu quero consultar uma solicitação de viagem por identificador para localizar um registro específico
- Como membro da equipe interna da instituição, eu quero cancelar uma solicitação de viagem já criada para interromper uma viagem que não deverá mais acontecer

Fluxos principais:

- Criar solicitação de viagem
- Listar solicitações de viagem
- Consultar solicitação por identificador
- Cancelar solicitação de viagem
- Consultar feriados nacionais por ano

Observação:

- Regras de validação, cenários de erro e casos extremos do produto estão detalhados na seção `Funcionalidades Principais` para evitar duplicação entre seções

## Funcionalidades Principais

### 1. Cadastro de solicitação de viagem

Esta funcionalidade permite registrar uma nova solicitação de viagem institucional na API. Ela é importante porque representa o fluxo principal do produto e centraliza o processo de cadastro em um único sistema.

No cadastro, o cliente deverá enviar os seguintes campos:

- `requesterName`
- `origin`
- `destination`
- `departureAt`
- `returnAt`
- `purpose`
- `passengerCount`

Os seguintes campos deverão ser gerados pela API:

- `id`
- `status`
- `createdAt`

Nas respostas expostas pela API, os estados observáveis da solicitação serão apenas `requested` e `canceled`.

Requisitos funcionais:

- RF-01. A API deverá permitir a criação de uma solicitação de viagem com os campos obrigatórios definidos
- RF-02. A API deverá gerar automaticamente os campos `id`, `status` e `createdAt`
- RF-03. A API deverá persistir e retornar a solicitação com o status `requested` quando a criação for concluída com sucesso
- RF-04. A API deverá validar que todos os campos obrigatórios da requisição foram informados
- RF-05. A API deverá rejeitar campos obrigatórios vazios
- RF-06. A API deverá rejeitar campos textuais obrigatórios que resultem em valor vazio após `trim`
- RF-07. A API deverá rejeitar solicitações em que `origin` e `destination` sejam iguais
- RF-08. A API deverá rejeitar solicitações em que `returnAt` seja anterior a `departureAt`
- RF-09. A API deverá rejeitar solicitações em que `passengerCount` seja menor ou igual a zero
- RF-10. A API deverá rejeitar solicitações em que `passengerCount` não seja um número inteiro positivo
- RF-11. A API deverá verificar primeiro no banco de dados local se existem feriados disponíveis para validar a data de saída informada
- RF-12. A API deverá consultar a BrasilAPI apenas quando os feriados necessários não existirem localmente, estiverem desatualizados ou houver necessidade de atualização
- RF-13. A API deverá armazenar localmente os dados de feriados obtidos da BrasilAPI para reutilização em validações futuras
- RF-14. A API deverá rejeitar solicitações em que `departureAt` corresponda a um feriado nacional
- RF-15. A API não deverá criar a solicitação quando precisar consultar a BrasilAPI e essa consulta estiver indisponível ou retornar erro
- RF-16. A API deverá aceitar datas válidas em formato ISO 8601 aceito pelo JavaScript
- RF-17. A API deverá normalizar os campos `departureAt` e `returnAt` para UTC com sufixo `Z` antes de persistir
- RF-18. A API deverá retornar os campos `departureAt`, `returnAt` e `createdAt` no formato `YYYY-MM-DDTHH:mm:ss.sssZ`

### 2. Listagem de solicitações de viagem

Esta funcionalidade permite consultar as solicitações de viagem já cadastradas. Ela é importante para viabilizar acompanhamento e consulta operacional dos registros existentes.

Requisitos funcionais:

- RF-19. A API deverá permitir listar as solicitações de viagem cadastradas
- RF-20. A listagem deverá retornar todas as solicitações cadastradas
- RF-21. A listagem deverá retornar uma lista vazia quando não existirem solicitações cadastradas
- RF-22. A listagem deverá retornar as solicitações ordenadas por `departureAt`, das mais recentes para as mais antigas

### 3. Consulta de solicitação por identificador

Esta funcionalidade permite localizar e retornar uma solicitação específica pelo seu identificador. Ela é importante para acesso direto a um registro individual.

Requisitos funcionais:

- RF-23. A API deverá permitir consultar uma solicitação de viagem por `id`
- RF-24. A consulta por `id` deverá retornar a solicitação completa
- RF-25. A API deverá retornar erro padronizado quando a solicitação consultada não existir

### 4. Cancelamento de solicitação de viagem

Esta funcionalidade permite cancelar uma solicitação de viagem já cadastrada. Ela é importante para refletir mudanças operacionais sem remover o histórico do registro.

O cancelamento será lógico. A solicitação continuará existindo, mas terá seu `status` alterado para `canceled`.

Requisitos funcionais:

- RF-26. A API deverá permitir cancelar uma solicitação existente
- RF-27. O cancelamento deverá alterar o campo `status` para `canceled`
- RF-28. O cancelamento não deverá remover a solicitação da base de dados
- RF-29. A API deverá retornar erro padronizado quando a solicitação a ser cancelada não existir
- RF-30. A API deverá impedir o cancelamento de uma solicitação já cancelada

### 5. Consulta de feriados nacionais por ano

Esta funcionalidade permite consultar os feriados nacionais de um ano específico. Ela é importante para expor a integração obrigatória com a BrasilAPI e suportar o fluxo de validação das solicitações de viagem.

Requisitos funcionais:

- RF-31. A API deverá disponibilizar a consulta de feriados nacionais por ano
- RF-32. A consulta de feriados deverá priorizar os dados armazenados localmente pela aplicação
- RF-33. A aplicação deverá utilizar a BrasilAPI para obter ou atualizar feriados quando os dados do ano solicitado não existirem localmente ou precisarem ser atualizados
- RF-34. A aplicação deverá armazenar localmente os feriados obtidos da BrasilAPI para reutilização posterior
- RF-35. A API deverá retornar erro padronizado quando precisar consultar a API externa de feriados e ela estiver indisponível ou retornar erro

### 6. Padronização de respostas de sucesso

Esta funcionalidade define um contrato consistente para respostas de sucesso da API. Ela é importante para permitir consumo previsível por clientes e manter uniformidade entre operações.

Formato base de sucesso:

```json
{
  "success": true,
  "data": {}
}
```

O campo `data` deverá conter o objeto ou a lista de objetos retornados pela operação.

Resposta de sucesso para criação:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "requesterName": "Maria Silva",
    "origin": "Parnaiba",
    "destination": "Teresina",
    "departureAt": "2026-06-24T10:00:00.000Z",
    "returnAt": "2026-06-24T18:00:00.000Z",
    "purpose": "Participation in an institutional meeting",
    "passengerCount": 3,
    "status": "requested",
    "createdAt": "2026-06-20T14:30:00.000Z"
  }
}
```

Resposta de sucesso para listagem:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "requesterName": "Maria Silva",
      "origin": "Parnaiba",
      "destination": "Teresina",
      "departureAt": "2026-06-24T10:00:00.000Z",
      "returnAt": "2026-06-24T18:00:00.000Z",
      "purpose": "Participation in an institutional meeting",
      "passengerCount": 3,
      "status": "requested",
      "createdAt": "2026-06-20T14:30:00.000Z"
    }
  ]
}
```

Resposta de sucesso para consulta por identificador:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "requesterName": "Maria Silva",
    "origin": "Parnaiba",
    "destination": "Teresina",
    "departureAt": "2026-06-24T10:00:00.000Z",
    "returnAt": "2026-06-24T18:00:00.000Z",
    "purpose": "Participation in an institutional meeting",
    "passengerCount": 3,
    "status": "requested",
    "createdAt": "2026-06-20T14:30:00.000Z"
  }
}
```

Resposta de sucesso para cancelamento:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "requesterName": "Maria Silva",
    "origin": "Parnaiba",
    "destination": "Teresina",
    "departureAt": "2026-06-24T10:00:00.000Z",
    "returnAt": "2026-06-24T18:00:00.000Z",
    "purpose": "Participation in an institutional meeting",
    "passengerCount": 3,
    "status": "canceled",
    "createdAt": "2026-06-20T14:30:00.000Z"
  }
}
```

Resposta de sucesso para consulta de feriados por ano:

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-01",
      "name": "Confraternizacao Universal",
      "type": "national"
    }
  ]
}
```

Requisitos funcionais:

- RF-36. A API deverá retornar respostas de sucesso no formato base definido neste documento
- RF-37. A operação de criação deverá retornar a solicitação criada com status `requested`
- RF-38. A operação de criação deverá retornar `201 Created`
- RF-39. A operação de listagem deverá retornar uma lista simples de solicitações no campo `data`
- RF-40. A operação de listagem deverá retornar `200 OK`
- RF-41. A operação de consulta por `id` deverá retornar a solicitação completa
- RF-42. A operação de consulta por `id` deverá retornar `200 OK`
- RF-43. A operação de cancelamento deverá retornar a solicitação atualizada com status `canceled`
- RF-44. A operação de cancelamento deverá retornar `200 OK`
- RF-45. A operação de consulta de feriados por ano deverá retornar uma lista de feriados no campo `data`
- RF-46. A operação de consulta de feriados por ano deverá retornar `200 OK`

### 7. Padronização de erros

Esta funcionalidade define um contrato consistente para respostas de erro da API. Ela é importante para permitir tratamento uniforme por clientes consumidores.

Formato de erro padronizado:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "A clear and objective error message"
  }
}
```

O campo `code` deverá conter um código interno padronizado, em inglês, escrito em `UPPER_SNAKE_CASE`.

O campo `message` deverá conter uma descrição clara e objetiva do erro, obrigatoriamente em inglês.

Códigos de erro obrigatórios:

- `VALIDATION_ERROR`
- `TRIP_REQUEST_NOT_FOUND`
- `TRIP_REQUEST_ALREADY_CANCELED`
- `HOLIDAY_TRIP_NOT_ALLOWED`
- `HOLIDAYS_API_UNAVAILABLE`
- `INTERNAL_SERVER_ERROR`

Requisitos funcionais:

- RF-47. A API deverá retornar respostas de erro no formato padronizado definido neste documento
- RF-48. A API deverá usar o código `VALIDATION_ERROR` para dados obrigatórios ausentes, inválidos ou em formato incorreto
- RF-49. A API deverá usar o código `TRIP_REQUEST_NOT_FOUND` quando a solicitação de viagem não for encontrada
- RF-50. A API deverá usar o código `TRIP_REQUEST_ALREADY_CANCELED` quando houver tentativa de cancelar uma solicitação já cancelada
- RF-51. A API deverá usar o código `HOLIDAY_TRIP_NOT_ALLOWED` quando a data de saída corresponder a um feriado nacional
- RF-52. A API deverá usar o código `HOLIDAYS_API_UNAVAILABLE` quando a consulta à API externa de feriados falhar em um cenário em que ela seja obrigatória
- RF-53. A API deverá usar o código `INTERNAL_SERVER_ERROR` para erros inesperados da aplicação
- RF-54. A API deverá retornar `400 Bad Request` para dados inválidos
- RF-55. A API deverá retornar `404 Not Found` para recurso não encontrado
- RF-56. A API deverá retornar `409 Conflict` para violação de regra de negócio
- RF-57. A API deverá retornar `502 Bad Gateway` para falha na API externa obrigatória
- RF-58. A API deverá retornar `500 Internal Server Error` para erro inesperado da aplicação

## Contrato Mínimo de Endpoints

Os endpoints mínimos da API deverão seguir este contrato:

- `POST /trip-requests`: cria uma nova solicitação de viagem
- `GET /trip-requests`: lista as solicitações cadastradas
- `GET /trip-requests/:id`: consulta uma solicitação específica
- `PATCH /trip-requests/:id/cancel`: cancela uma solicitação existente
- `GET /holidays/:year`: consulta os feriados nacionais de um determinado ano

## Experiência do Usuário

Esta solução será consumida exclusivamente como API, sem interface gráfica própria. A interação ocorrerá por uso manual da equipe técnica da instituição.

Persona principal:

- Equipe técnica interna responsável por enviar requisições para criar, consultar e cancelar solicitações de viagem

Necessidades principais da persona:

- Registrar solicitações de viagem com os dados obrigatórios definidos
- Consultar rapidamente viagens cadastradas
- Localizar uma solicitação específica por identificador
- Cancelar uma solicitação existente quando necessário
- Receber respostas consistentes e previsíveis da API
- Entender com clareza quando uma operação falhar e qual foi o motivo

Jornada principal do usuário:

1. O usuário envia uma solicitação de criação de viagem com os campos obrigatórios
2. A API valida os dados recebidos, consulta a BrasilAPI quando necessário e retorna a solicitação criada em caso de sucesso
3. O usuário consulta a lista de solicitações cadastradas para acompanhar os registros existentes
4. O usuário consulta uma solicitação específica por identificador quando precisa verificar um registro individual
5. O usuário cancela uma solicitação cadastrada quando a viagem não deverá mais ocorrer

Fluxos e interações principais:

- Criação de solicitação com validação de regras de negócio
- Listagem de solicitações ordenadas por `departureAt`
- Consulta individual por identificador
- Cancelamento lógico de solicitação
- Consulta de feriados nacionais por ano
- Recebimento de erros padronizados em cenários de falha

Expectativas de experiência:

- Respostas claras
- Erros objetivos
- Contrato previsível
- Rapidez nas operações

Considerações de UI/UX:

- Não se aplicam requisitos de interface gráfica nesta versão, pois o produto será disponibilizado apenas como API
- A experiência de uso dependerá principalmente da clareza do contrato da API, da consistência das respostas e da objetividade das mensagens de erro

Requisitos de acessibilidade:

- Não se aplicam nesta versão, pois o produto não possui interface gráfica própria

Experiência mínima em falhas:

- Quando uma operação falhar, a API deverá retornar erro padronizado, claro, objetivo e em inglês

## Restrições Técnicas de Alto Nível

Integrações e dependências obrigatórias:

- A API deverá integrar com a BrasilAPI para verificação de feriados nacionais
- A aplicação deverá persistir os dados das solicitações de viagem em banco de dados
- Não será aceita implementação apenas em memória

Segurança e autenticação:

- Não haverá autenticação nesta versão do produto
- A API será de uso liberado, podendo ser utilizada por qualquer pessoa que tenha acesso ao código e à execução da aplicação

Performance e escalabilidade:

- Não há metas avançadas de performance ou escalabilidade nesta versão
- A solução deverá atender ao funcionamento básico esperado para seu uso pretendido

Sensibilidade de dados e privacidade:

- Não há exigências específicas de tratamento de dados sensíveis nesta versão

Detalhes de stack, infraestrutura local, configuração por ambiente e decisões de implementação foram movidos para `doc/tech-spec.md`.

Restrições operacionais:

- Não há outras restrições operacionais adicionais definidas nesta versão

## Fora de Escopo

Esta versão do produto não incluirá as seguintes funcionalidades:

- Edição de solicitações de viagem já criadas
- Exclusão física de solicitações de viagem
- Autenticação
- Autorização
- Cadastro de usuários
- Perfis diferenciados de acesso
- Aprovação ou reprovação de solicitações
- Filtros além da consulta por identificador
- Interface gráfica própria
- Frontend
- Alocação de veículo
- Alocação de motorista
- Check-in ou check-out da viagem
- Controle de quilometragem
- Relatórios administrativos
- Integrações externas além da BrasilAPI para feriados nacionais

Limites desta versão:

- Todos os usuários com acesso à API possuem as mesmas permissões
- A decisão de aceitar ou rejeitar o cadastro de uma viagem dependerá exclusivamente das regras de negócio definidas na aplicação
- O produto será disponibilizado apenas como API, sem frontend próprio

## Questões em Aberto

No momento, não há questões em aberto registradas para a versão atual do produto.
