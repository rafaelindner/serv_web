# Biblioteca

Esta é uma API de de uma biblioteca, servindo para gerenciar livros. Permite realizar operações CRUD utilizando Node.js, MySQL e JWT.

## Pré-requisitos

Antes de começar, instale as seguintes ferramentas;

- MySQL 
- Node.js 

## Instale as dependências

```bash
npm install

Configuração do Banco de Dados
Crie um banco de dados MySQL chamado livrosdb:

Execute o script SQL para criar as tabelas e inserir dados iniciais.
Substitua seu_usuario pelo seu usuário do MySQL e digite sua senha quando solicitado.
Variáveis de Ambiente
No arquivo .env ajuste as variáveis de ambiente conforme necessário:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=livrosdb
PORT=3306
JWT_SECRET=servicosWeb

Executando a Aplicação
npm start

Uso da API
A API possui as seguintes rotas principais:

Registro de Usuário: POST /register
Corpo da requisição: { "nome": "seu_nome", "senha": "sua_senha" }
Resposta: { "retorno": "Cadastrado com sucesso", "id": <id_do_usuario>, "nome": "seu_nome" }
Login de Usuário: POST /login
Corpo da requisição: { "nome": "seu_nome", "senha": "sua_senha" }
Resposta: { "token": "seu_token_jwt" }
Operações CRUD de Livros:
GET /books: Lista todos os livros
POST /books: Adiciona um novo livro
PUT /books/:id: Atualiza um livro existente
DELETE /books/:id: Deleta um livro existente
GET /books/:id: Consulta um único livro
