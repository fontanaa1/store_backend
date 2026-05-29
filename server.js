const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./logger');
const errorHandler = require('./errorHandler');

const rotasProdutos = require('./produtos');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);


// =============================
// ROTAS
// =============================

app.use('/api/produtos', rotasProdutos);


// ROTA RAIZ
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: '🛍️ API da B7Store funcionando!'
    });
});


// ROTA API
app.get('/api', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: '📦 API online.'
    });
});

// Adicione no server.js, depois das outras rotas
const rotasClientes = require('./clientes');

// Rotas de clientes
app.use('/api/clientes', rotasClientes);

// =============================
// LOGIN ADMIN
// =============================

const supabase = require('./supabase');

app.post('/api/auth/login', async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                sucesso: false,
                error: 'E-mail e senha obrigatórios.'
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                sucesso: false,
                error: error.message
            });
        }

        return res.json({
            sucesso: true,
            token: data.session.access_token
        });

    } catch (err) {
        next(err);
    }
});


// =============================
// 404
// =============================

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.'
    });
});


// =============================
// ERROR HANDLER
// =============================

app.use(errorHandler);


// =============================
// SERVIDOR
// =============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
