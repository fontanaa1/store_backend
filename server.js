// =============================================================
// server.js — Servidor Principal da API do B7Store
// =============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./logger');
const errorHandler = require('./errorHandler');
const supabase = require('./supabase');

// Importação das rotas (todos na raiz)
const rotasProdutos = require('./produtos');
const rotasClientes = require('./clientes'); // ← clientes na raiz

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(logger);

// Rotas da API
app.use('/api/produtos', rotasProdutos);
app.use('/api/clientes', rotasClientes); // ← Adiciona as rotas de clientes

// Rota raiz
app.get('/', (req, res) => {
    res.json({ 
        sucesso: true,
        mensagem: '🛍️ Bem-vindo à API Oficial da Loja B7Store!' 
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        sucesso: true,
        mensagem: '📦 API da B7Store está funcionando perfeitamente!' 
    });
});

// Tratamento de rota não encontrada
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `⚠️ A rota '${req.url}' não existe na nossa API.`
    });
});

// Middleware de erros global
app.use(errorHandler);

// Inicialização
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log('');
    console.log(' ==========================================');
    console.log(` 🛍️  Servidor da B7Store rodando com sucesso!`);
    console.log(` Acesso Local: http://localhost:${PORTA}`);
    console.log(' ==========================================');
    console.log('');
    console.log('📋 Rotas da API:');
    console.log(`   GET    /api/produtos`);
    console.log(`   POST   /api/clientes/register`);
    console.log(`   POST   /api/clientes/login`);
    console.log(`   GET    /api/clientes/carrinho`);
    console.log(`   POST   /api/clientes/carrinho`);
    console.log(`   POST   /api/clientes/finalizar`);
    console.log('');
});

module.exports = app;
