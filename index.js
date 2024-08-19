require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./auth');

// Configurações
const PORT = 3000;
const app = express();
app.use(express.json());

// Connect com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Função para gerar hash de senha
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Rota de registro de usuário
app.post('/register', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const hashedPassword = hashPassword(senha);
    db.query('INSERT INTO USER (nome, senha) VALUES (?, ?)', [nome, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
        res.status(201).json({retorno: "Cadastrado com sucesso", id: result.insertId, nome });
    });
});

// Rota de login de usuário
app.post('/login', (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    db.query('SELECT * FROM USER WHERE nome = ?', [nome], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const hashedPassword = hashPassword(senha);
        if (hashedPassword !== results[0].senha) {
            return res.status(401).json({ error: 'Nome ou senha inválidos' });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    });
});

// Middleware de autenticação
app.use(auth);

// Rota GET para listar todos os livros
app.get('/books', (req, res) => {
    db.query('SELECT * FROM LIVRO', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        res.json(results);
    });
});

// Rota POST para criar um novo livro
app.post('/books', (req, res) => {
    const { titulo, autor, ano_de_publicacao } = req.body;
    if (!titulo || !autor) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    const query = 'INSERT INTO LIVRO (titulo, autor, ano_de_publicacao) VALUES (?, ?, ?)';
    db.query(query, [titulo, autor, ano_de_publicacao], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao criar livro' });
        }
        res.status(201).json({ id: result.insertId, titulo, autor, ano_de_publicacao });
    });
});

// Rota PUT para atualizar um livro
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor, ano_de_publicacao } = req.body;
    
    if (!titulo || !autor) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const query = 'UPDATE LIVRO SET titulo = ?, autor = ?, ano_de_publicacao = ? WHERE id = ?';
    db.query(query, [titulo, autor, ano_de_publicacao, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar livro' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json({ message: 'Livro atualizado com sucesso' });
    });
});

// Rota GET para consultar um único livro
app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM LIVRO WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar livro' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json(result[0]);
    });
});

// Rota DELETE para excluir um livro
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM LIVRO WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao excluir livro' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.json({ message: 'Livro excluído com sucesso' });
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

