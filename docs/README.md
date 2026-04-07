# Lotus API Docs

## Swagger / OpenAPI
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## JWT de teste
Use este valor para ambiente local:
- `jwt-test-secret-dev-change-me`

## Como gerar token rapido
1. Faça `POST /auth/register` com email e senha.
2. Faça `POST /auth/login`.
3. Copie o campo `token` da resposta.
4. No Swagger, clique em `Authorize` e informe: `Bearer <token>`.

## Insomnia
Arquivo de importacao pronto:
- `docs/insomnia-lotus.json`

Passos:
1. Abra o Insomnia.
2. Clique em `Create` -> `Import` -> `From File`.
3. Selecione `docs/insomnia-lotus.json`.
4. No ambiente importado, ajuste `base_url` se necessario.
