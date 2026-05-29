// =============================================================
// produtos.js — Rotas do Catálogo conectadas ao Supabase
// =============================================================
const express = require('express');
const router = express.Router();
const supabase = require('./supabase'); // Importa a conexão do seu Supabase

// 🔍 1. BUSCAR TODOS OS PRODUTOS (GET /api/produtos)
router.get('/', async (req, res, next) => {
    try {
        // Busca os produtos diretamente na tabela do Supabase
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error; // Joga o erro para o middleware errorHandler
        }

        // Retorna a lista vinda do banco (se estiver vazia no banco, retorna [])
        res.json(data);
    } catch (erro) {
        next(erro);
    }
});

// 🔍 2. BUSCAR UM PRODUTO POR ID (GET /api/produtos/:id)
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .single(); // Traz apenas um único objeto em vez de uma lista

        if (error) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(data);
    } catch (erro) {
        next(erro);
    }
});

// 💾 3. CADASTRAR UM NOVO PRODUTO (POST /api/produtos)
router.post('/', async (req, res, next) => {
    try {
        const { nome, preco, imagem_url, info } = req.body;

        // Validação simples de campos obrigatórios
        if (!nome || !preco) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Nome e preço são obrigatórios!" 
            });
        }

        // Insere o produto no Supabase e pede para retornar o item criado (.select())
        const { data, error } = await supabase
            .from('produtos')
            .insert([{ nome, preco, imagem_url, info }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "✨ Produto gravado com sucesso no Supabase!",
            produto: data[0]
        });
    } catch (erro) {
        next(erro);
    }
});

// 📝 4. ATUALIZAR UM PRODUTO (PUT /api/produtos/:id)
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, preco, imagem_url, info } = req.body;

        const { data, error } = await supabase
            .from('produtos')
            .update({ nome, preco, imagem_url, info })
            .eq('id', id)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            sucesso: true,
            mensagem: "Produto atualizado com sucesso!",
            produto: data[0]
        });
    } catch (erro) {
        next(erro);
    }
});

// ❌ 5. DELETAR UM PRODUTO (DELETE /api/produtos/:id)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        res.json({ 
            sucesso: true, 
            mensagem: `Produto #${id} removido com sucesso!` 
        });
    } catch (erro) {
        next(erro);
    }
});

module.exports = router;