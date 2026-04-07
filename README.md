# Desafio Fullstack Lotus

Projeto fullstack com backend Spring Boot e frontend React para gerenciamento de usuarios, projetos e tarefas.

## Stack e justificativa
- Backend: Spring Boot 3 + Spring Security + Spring Data JPA
- Banco: H2 (simples para setup local e avaliacao rapida)
- Auth: JWT + BCrypt
- Docs de API: Springdoc OpenAPI (Swagger UI)
- Frontend: React + Vite
- Containers: Docker Compose

Motivacao da stack:
- Spring Boot entrega produtividade alta e padrao de mercado para APIs REST.
- JWT + BCrypt cobre autenticacao stateless e armazenamento seguro de senha.
- H2 reduz friccao no ambiente de desenvolvimento e avaliacao.
- OpenAPI facilita validacao dos endpoints e onboarding tecnico.

## Requisitos
- Java 17+
- Maven (ou usar `mvnw`)
- Node 18+
- Docker e Docker Compose (opcional)

## Configuracao de ambiente
Ja existem arquivos `.env` prontos para desenvolvimento local com segredo de teste.

Arquivos principais:
- `.env`
- `backend/lotus/.env`
- `frontend/.env`

## Rodando o backend local
1. Entre em `backend/lotus`
2. Execute:

```bash
./mvnw spring-boot:run
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

## Rodando o frontend local
1. Entre em `frontend`
2. Execute:

```bash
npm install
npm run dev
```

## Docker Compose
Na raiz do projeto:

```bash
docker compose up --build
```

## Swagger / OpenAPI
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Docs e Insomnia
- Guia: `docs/README.md`
- Colecao Insomnia: `docs/insomnia-lotus.json`

## Testes
No backend:

```powershell
.\mvnw.cmd test
```
