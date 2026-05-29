// =============================================================
// server.js — Servidor Principal da API do B7Store
// =============================================================

// ─── 1. Importações das Dependências ─────────────────────────
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ─── 2. Importação dos Middlewares Customizados ───────────────
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// ─── 3. Importação das Rotas Modulares ────────────────────────
const rotasLoja = require('./routes/loja'); // Importa o arquivo que criamos acima

// ─── 4. Criação da Aplicação Express ─────────────────────────
const app = express();

// ─── 5. Registro dos Middlewares Globais ─────────────────────
app.use(cors());
app.use(express.json());
app.use(logger); // Anota as requisições no terminal

// ─── 6. Rota de Boas-Vindas (Garante Sucesso na Raiz da Vercel) 
app.get('/', (req, res) => {
    res.json({ 
        sucesso: true,
        mensagem: '🛍️ Bem-vindo à API Oficial da Loja B7Store!' 
    });
});

// ─── 7. Registro Oficial do Router Modularizado ───────────────
// Vincula todas as rotas de loja.js sob o prefixo /api
app.use('/api', rotasLoja);

// ─── 8. Tratamento de Rota não encontrada (Erro 404) ──────────
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API da B7Store.`
    });
});

// ─── 9. Middleware de Erros Global (errorHandler) ─────────────
app.use(errorHandler);

// ─── 10. Inicializando o Servidor Local ───────────────────────
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log('');
    console.log(' ==========================================');
    console.log(` 🛍️  Servidor da B7Store rodando com sucesso!`);
    console.log(` Acesso Local: http://localhost:${PORTA}`);
    console.log(' ==========================================');
    console.log('');
    console.log('📋 Rotas disponíveis através do Router:');
    console.log(`   GET    /`);
    console.log(`   GET    /api/produtos`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/produtos`);
    console.log('');
});

module.exports = app;
