-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS livrosdb;

-- Usar o banco de dados criado
USE livrosdb;

-- Criar tabela LIVRO
CREATE TABLE IF NOT EXISTS LIVRO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_de_publicacao INT
);

-- Criar tabela USER
CREATE TABLE IF NOT EXISTS USER (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- Inserir dados iniciais
INSERT INTO LIVRO (titulo, autor, ano_de_publicacao) VALUES
    ('Dom Casmurro', 'Machado de Assis', 1899),
    ('O Alquimista', 'Paulo Coelho', 1988);
