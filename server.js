// =============================================================
// server.js — Servidor Principal da API do B7Store
// =============================================================

// ─── 1. Importações das Dependências ─────────────────────────
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ─── 2. Importação dos Módulos e Middlewares da Mesma Pasta ──
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const supabase = require('./supabase'); // Importa o supabase que está ao lado!

// ─── 3. Criação da Aplicação Express ─────────────────────────
const app = express();

// ─── 4. Registro dos Middlewares Globais ─────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ─── 5. Rota Raiz (Evita erro 404 de cara na Vercel) ─────────
app.get('/', (req, res) => {
    res.json({ 
        sucesso: true,
        mensagem: '🛍️ Bem-vindo à API Oficial da Loja B7Store!' 
    });
});

// Mapeamento extra opcional para o caso de tentarem acessar /api
app.get('/api', (req, res) => {
    res.json({ 
        sucesso: true,
        mensagem: '📦 Endpoints da B7Store operacionais.' 
    });
});


// ─── 6. Rotas Oficiais da Loja (Sem subpastas para não quebrar) 

// ROTA: Buscar todos os produtos (Público para a Vitrine)
app.get('/api/produtos', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('criado_em', { ascending: false });

        if (error) throw new Error(error.message);
        return res.status(200).json(data);
    } catch (err) {
        next(err); // Repassa o erro para o errorHandler global
    }
});

// ROTA: Login do Administrador (Gera Token)
app.post('/api/auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ sucesso: false, error: "E-mail e senha são obrigatórios." });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ sucesso: false, error: "Acesso negado: " + error.message });

        return res.status(200).json({ 
            sucesso: true,
            message: "Login efetuado com sucesso!", 
            token: data.session.access_token 
        });
    } catch (err) {
        next(err);
    }
});

// ROTA: Cadastrar Novo Produto (Protegido por Token JWT)
app.post('/api/produtos', async (req, res, next) => {
    try {
        const { nome, preco, imagem_url, info } = req.body;
        const authHeader = req.headers.authorization;
        
        if (!authHeader) return res.status(401).json({ sucesso: false, error: "Não autorizado. Token faltando." });
        const token = authHeader.split(' ')[1];

        // Valida se o Token pertence a uma sessão ativa no Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ sucesso: false, error: "Sessão inválida ou expirada." });

        if (!nome || !preco) {
            return res.status(400).json({ sucesso: false, error: "Nome e preço são obrigatórios." });
        }

        const { data, error } = await supabase
            .from('produtos')
            .insert([{ nome, preco: parseFloat(preco), imagem_url, info }]);

        if (error) throw new Error(error.message);
        return res.status(201).json({ sucesso: true, message: "Produto cadastrado com sucesso!" });
    } catch (err) {
        next(err);
    }
});


// ─── 7. Tratamento de Rota não encontrada (Erro 404) ──────────
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API da B7Store.`
    });
});

// ─── 8. Middleware de Erros Global (errorHandler) ─────────────
app.use(errorHandler);


// ─── 9. Inicializando o Servidor Local ────────────────────────
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log('');
    console.log(' ==========================================');
    console.log(` 🛍️  Servidor da B7Store rodando com sucesso!`);
    console.log(` Acesso Local: http://localhost:${PORTA}`);
    console.log(' ==========================================');
    console.log('');
    console.log('📋 Rotas da API mapeadas na raiz:');
    console.log(`   GET    /`);
    console.log(`   GET    /api/produtos`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   POST   /api/produtos`);
    console.log('');
});

module.exports = app;