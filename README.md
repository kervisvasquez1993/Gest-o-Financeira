# Gestão Financeira — API

API REST para que os colaboradores de uma empresa registrem e acompanhem suas movimentações financeiras por categoria (despesas operacionais, receitas de clientes, reembolsos, etc.). Cada usuário enxerga **apenas seus próprios dados**.

Construída em **NestJS + TypeScript (strict mode)**, com **PostgreSQL** via **TypeORM** e autenticação **JWT**.

---

## Links

- **API em produção (Swagger):** https://dev.backend-api-agua.shop/api/docs
- **Repositório wrapper (execução local de backend + frontend):** https://github.com/kervisvasquez1993/wrapper-gestao-financiera

> Este repositório contém **apenas o backend** e está pensado para **deploy em produção** (publicado em um VPS na Hostinger via Dokploy). Para rodar o projeto completo localmente (backend + frontend com um único comando), utilize o **repositório wrapper** acima, que orquestra ambos os serviços via Docker Compose e contém as instruções de execução local.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | NestJS 11 |
| Linguagem | TypeScript (strict) |
| Banco de dados | PostgreSQL |
| ORM | TypeORM (migrations) |
| Autenticação | JWT (`@nestjs/jwt`) + Guard próprio |
| Validação | class-validator + class-transformer |
| Documentação | Swagger (OpenAPI) |
| Hash de senha | bcrypt |
| Config | Joi (validação de variáveis de ambiente) |

---

## Decisões técnicas e arquiteturais

### Sobre a arquitetura escolhida (e o enunciado)

O enunciado indica que **não é necessário DDD** e pede para evitar over-engineering. A organização adotada aqui — separação em camadas (domínio, aplicação, infraestrutura, apresentação) com ports e use-cases — **não é uma exigência do problema, mas uma decisão consciente** pelos seguintes motivos:

- **Testabilidade**: com os casos de uso isolados e as dependências atrás de ports (`abstract class`), os testes ficam simples e limpos — basta mockar a porta, sem tocar no banco nem no framework. Isso atende diretamente ao requisito de testes significativos.
- **Clareza e separação de responsabilidades**: cada operação é uma classe com responsabilidade única, o que torna o código fácil de ler e manter — exatamente o critério de avaliação de peso **Alto** (Arquitetura & Módulos).
- **Produtividade**: é a forma de trabalho com a qual tenho mais fluidez e confiança; aplicá-la não adicionou tempo nem complexidade ao desenvolvimento.

A separação foi mantida **proporcional ao problema** — sem microsserviços, sem CQRS, sem event sourcing, sem filas. É uma Clean Architecture leve, voltada a manutenção e testes, não uma demonstração de padrões.

### Organização por módulos

O projeto é organizado por **bounded context** (um módulo por contexto: `auth`, `users`, `categories`, `transactions`, `dashboard`). Cada módulo segue a separação:

```
modules/<contexto>/
├── domain/            # regra de negócio pura
│   ├── entities/      # entidades (TypeORM)
│   ├── enums/         # enums de domínio
│   ├── ports/         # contratos (abstract classes) = portas
│   └── errors/        # erros de domínio
├── application/       # orquestração
│   ├── dtos/          # entrada validada (class-validator)
│   └── use-cases/     # um caso de uso por operação
├── infrastructure/    # implementações concretas das portas
│   └── repositories/  # repositórios TypeORM
└── presentation/      # controllers HTTP
```

- **Ports como `abstract class`**: as interfaces de TypeScript desaparecem em runtime e não servem como token de injeção de dependência. Usar `abstract class` permite o binding `{ provide: Repository, useClass: TypeOrmRepository }` e troca de implementação sem tocar no domínio.
- **Domínio independente de infraestrutura**: os use-cases dependem da porta (`CategoryRepository`), não da implementação concreta (`TypeOrmCategoryRepository`).

### Isolamento por usuário (multi-tenant por linha)

Todo dado pertence a um usuário. O **escopo por `userId` vive no repositório**, não no controller — assim nenhum caso de uso consegue, por engano, vazar dados de outro usuário. Todas as queries filtram por `user_id`, e buscas por ID usam `findByIdAndUser`. Se um recurso não pertence ao usuário autenticado, a resposta é **404** (não revela existência).

### Autenticação JWT sem Passport

Optou-se por `@nestjs/jwt` com um **Guard próprio** (`JwtAuthGuard`) em vez de Passport, para manter o fluxo explícito e com menos dependências. O guard:

1. Extrai o token do header `Authorization: Bearer <token>`.
2. Valida com `JwtService.verifyAsync`.
3. Injeta `{ id, email }` em `request.user`, acessível via o decorator `@CurrentUser()`.

### Respostas padronizadas e tratamento global de exceções

- **`TransformInterceptor`** (global): envelopa toda resposta de sucesso em `{ success: true, data: ... }`.
- **`AllExceptionsFilter`** (global): captura qualquer erro e devolve um formato consistente. Mapeia **erros de domínio** para status HTTP corretos:

| Erro de domínio | HTTP |
|---|---|
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `ValidationError` | 400 |

Os controllers e use-cases **nunca** lançam `HttpException` diretamente — lançam erros de domínio semânticos, e o filtro traduz. Isso mantém o domínio livre de detalhes de HTTP.

### Validação de ambiente com Joi

As variáveis de ambiente são validadas no boot (`src/config/envs.ts`). Se faltar uma variável obrigatória ou estiver com tipo errado, a aplicação **falha ao iniciar** com mensagem clara, em vez de quebrar em runtime.

### Tipo de transação como enum

`type` é um enum (`entrada` | `saida`, sem acento para evitar problemas de encoding). O valor (`amount`) é sempre **positivo**; o sinal é dado pelo `type`. Assim o saldo é simplesmente `SUM(entradas) − SUM(saídas)`.

### Dashboard calculado no banco

Os números do dashboard (saldo, totais, top categorias) são calculados via **SQL** (`SUM` com `CASE`, `GROUP BY`, `ORDER BY`, `LIMIT`), atendendo ao requisito de que os dados venham prontos da API e não sejam calculados no frontend.

### Integridade referencial

- `categories.user_id` → `users.id` com **`ON DELETE CASCADE`** (apagar o usuário apaga suas categorias).
- `transactions.user_id` → `users.id` com **`ON DELETE CASCADE`**.
- `transactions.category_id` → `categories.id` com **`ON DELETE RESTRICT`** (não permite apagar uma categoria que tenha transações, preservando o histórico financeiro).
- Índice único `(user_id, name)` em `categories`: não há nomes de categoria repetidos por usuário.

---

## Estrutura do projeto

```
src/
├── config/
│   └── envs.ts                     # validação de env com Joi
├── shared/
│   ├── database/                   # config TypeORM, data-source, transformers
│   ├── decorators/                 # @CurrentUser
│   ├── errors/                     # erros de domínio base
│   ├── filters/                    # AllExceptionsFilter
│   ├── guards/                     # JwtAuthGuard
│   ├── interceptors/               # TransformInterceptor
│   └── responses/                  # contratos de resposta (paginação, etc.)
├── modules/
│   ├── auth/                       # registro, login, JWT
│   ├── users/                      # entidade User, /me
│   ├── categories/                 # CRUD de categorias
│   ├── transactions/              # CRUD + paginação + filtros
│   └── dashboard/                  # resumo financeiro
├── migrations/                     # migrations TypeORM
├── app.module.ts
└── main.ts
```

---

## Modelo de dados

### users
| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| name | varchar(150) | |
| email | varchar(180) | único |
| password_hash | varchar | hash bcrypt |
| created_at / updated_at | timestamptz | |

### categories
| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| name | varchar(120) | único por usuário |
| description | varchar(255) | opcional |
| user_id | uuid | FK → users (CASCADE) |
| created_at / updated_at | timestamptz | |

### transactions
| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| description | varchar(255) | |
| amount | numeric(12,2) | sempre positivo |
| type | enum | `entrada` \| `saida` |
| date | date | |
| category_id | uuid | FK → categories (RESTRICT) |
| user_id | uuid | FK → users (CASCADE) |
| created_at / updated_at | timestamptz | |

---

## API

Prefixo global: **`/api`**. Documentação interativa completa via **Swagger** em `/api/docs` (em produção: https://dev.backend-api-agua.shop/api/docs).

Todas as rotas (exceto `register` e `login`) exigem o header:

```
Authorization: Bearer <accessToken>
```

Toda resposta de sucesso vem envelopada:

```json
{ "success": true, "data": { ... } }
```

### Autenticação

#### `POST /api/auth/register`
Request:
```json
{ "name": "Kervis", "email": "kervis@test.com", "password": "123456" }
```
Response `201`:
```json
{ "success": true, "data": { "id": "uuid", "name": "Kervis", "email": "kervis@test.com" } }
```
Erros: `409` e-mail já cadastrado · `400` payload inválido.

#### `POST /api/auth/login`
Request:
```json
{ "email": "kervis@test.com", "password": "123456" }
```
Response `200`:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "user": { "id": "uuid", "name": "Kervis", "email": "kervis@test.com" }
  }
}
```
Erros: `401` credenciais inválidas.

---

### Usuário

#### `GET /api/users/me`
Retorna o perfil do usuário autenticado.

Response `200`:
```json
{ "success": true, "data": { "id": "uuid", "name": "Kervis", "email": "kervis@test.com", "createdAt": "..." } }
```

---

### Categorias

Pertencem ao usuário autenticado. Nome único por usuário.

#### `POST /api/categories`
Request:
```json
{ "name": "Fornecedor", "description": "Pagamentos a fornecedores" }
```
`description` é opcional. Erros: `409` nome já existe · `400` payload inválido.

#### `GET /api/categories`
Lista todas as categorias do usuário.

#### `GET /api/categories/summary`
Lista as categorias do usuário com estatísticas: `transactionsCount`, `totalEntradas`, `totalSaidas`.

#### `GET /api/categories/:id`
Retorna uma categoria. `404` se não existir ou não pertencer ao usuário.

#### `PATCH /api/categories/:id`
Atualização parcial.
```json
{ "name": "Fornecedores", "description": "Atualizado" }
```
Erros: `409` nome já existe · `404` não encontrada.

#### `DELETE /api/categories/:id`
Response `200`:
```json
{ "success": true, "data": { "message": "Categoría eliminada exitosamente." } }
```
Erro: `409` se a categoria tiver transações associadas (RESTRICT).

---

### Transações

Pertencem ao usuário autenticado. A categoria informada deve pertencer ao usuário.

#### `POST /api/transactions`
Request:
```json
{
  "description": "Pagamento a fornecedor",
  "amount": 150.50,
  "type": "saida",
  "date": "2026-06-16",
  "categoryId": "uuid-da-categoria"
}
```
Regras: `type` ∈ `entrada` | `saida` · `amount` positivo, máx. 2 casas decimais · `date` no formato `YYYY-MM-DD`. Erros: `404` categoria inexistente/não pertence ao usuário · `400` payload inválido.

#### `GET /api/transactions`
Lista com **paginação** e **filtros**, todos via query params (combináveis).

| Param | Tipo | Descrição |
|---|---|---|
| `type` | `entrada` \| `saida` | filtra por tipo |
| `categoryId` | uuid | filtra por categoria |
| `startDate` | `YYYY-MM-DD` | data inicial (inclusive) |
| `endDate` | `YYYY-MM-DD` | data final (inclusive) |
| `search` | string | busca parcial na descrição (case-insensitive) |
| `page` | int ≥ 1 | página (default 1) |
| `limit` | int 1–100 | itens por página (default 10) |

Exemplo:
```
GET /api/transactions?type=saida&categoryId=uuid&startDate=2026-06-01&endDate=2026-06-30&search=pagamento&page=1&limit=10
```
Response `200`:
```json
{
  "success": true,
  "data": {
    "data": [ { "id": "...", "description": "...", "amount": 150.5, "type": "saida", "date": "2026-06-16", "category": { ... } } ],
    "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

#### `GET /api/transactions/:id`
Retorna uma transação (com a categoria aninhada). `404` se não pertencer ao usuário.

#### `PATCH /api/transactions/:id`
Atualização parcial (mesmos campos do create, todos opcionais).
```json
{ "amount": 200.00, "description": "Pagamento atualizado" }
```

#### `DELETE /api/transactions/:id`
Response `200`:
```json
{ "success": true, "data": { "message": "Transacción eliminada exitosamente." } }
```

---

### Dashboard

Resumo financeiro do usuário autenticado, calculado no banco.

#### `GET /api/dashboard`
Query params opcionais:

| Param | Tipo | Descrição |
|---|---|---|
| `startDate` | `YYYY-MM-DD` | início do período (inclusive) |
| `endDate` | `YYYY-MM-DD` | fim do período (inclusive) |

Sem params, considera todo o histórico. O período aplica-se a todos os cálculos.

Response `200`:
```json
{
  "success": true,
  "data": {
    "saldoAtual": 2259.6,
    "totalEntradas": 2500,
    "totalSaidas": 240.4,
    "topCategoriasSaidas": [
      { "categoryId": "uuid", "categoryName": "categoria1", "total": 150.5 },
      { "categoryId": "uuid", "categoryName": "categoria3", "total": 89.9 }
    ],
    "periodo": { "startDate": "2026-06-01", "endDate": "2026-06-30" }
  }
}
```

Campos:
- `saldoAtual`: `totalEntradas − totalSaidas`.
- `totalEntradas` / `totalSaidas`: somas no período.
- `topCategoriasSaidas`: as 3 categorias com maior volume de **saídas**.

---

## Testes

Os testes focam na **camada de casos de uso**, onde vive a regra de negócio. Graças aos ports (`abstract class`), as dependências são mockadas facilmente, sem necessidade de banco de dados — testes rápidos, determinísticos e relevantes (não busca por cobertura de 100%, e sim por significância, conforme o enunciado).

Atualmente são **11 testes em 5 suites**, cobrindo os critérios de avaliação de peso **Alto**:

| Suite | Casos cobertos |
|---|---|
| `RegisterUseCase` | Rejeita e-mail duplicado; gera hash da senha e cria o usuário |
| `LoginUseCase` | Retorna token com credenciais válidas; rejeita usuário inexistente e senha incorreta |
| `CreateCategoryUseCase` | Impede nome de categoria duplicado por usuário; cria quando é único |
| `CreateTransactionUseCase` | Garante que a categoria pertence ao usuário (autorização); cria quando válida |
| `GetDashboardUseCase` | Calcula corretamente o saldo e o top de categorias; trata período sem datas |

Configuração: os testes usam Jest (já incluído no NestJS) com `ts-jest`. Um `moduleNameMapper` resolve imports absolutos (`src/...`) durante a execução dos testes.

Executar:
```bash
npm run test         # roda todos os testes
npm run test:cov     # com relatório de cobertura
npm run test:watch   # modo watch
```

## Variáveis de ambiente

Ver `.env.example`. Validadas no boot via Joi.

| Variável | Descrição |
|---|---|
| `PORT` | porta da aplicação |
| `DB_HOST` / `DB_PORT` | host e porta do PostgreSQL |
| `DB_USERNAME` / `DB_PASSWORD` | credenciais |
| `DB_NAME` | nome do banco |
| `JWT_SECRET` | segredo para assinar os tokens |
| `JWT_EXPIRES_IN` | expiração do token (ex. `1d`) |
| `CORS_ORIGIN` | origin permitido para CORS (ex. URL do frontend) |

---

## Execução

Este backend é destinado a **deploy em produção** (Docker, publicado em VPS via Dokploy). A imagem é construída a partir do `Dockerfile` (multi-stage: build com Node + imagem final liviana com `dist` compilado).

Para executar o **projeto completo localmente** (backend + frontend + PostgreSQL com um único comando), use o repositório wrapper:

👉 https://github.com/kervisvasquez1993/wrapper-gestao-financiera

---

## Convenções de commit

O projeto usa **Husky** + **commitlint** (Conventional Commits), com limite de 100 caracteres no header e tipos restritos (`feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`, `style`, `revert`).

Formato: `tipo(escopo): descrição`

```
feat(transactions): add crud with pagination and filters
fix(categories): scope queries to authenticated user
```