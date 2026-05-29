// =============================================================
// produtos.js — Rotas do Catálogo conectadas ao Supabase
// =============================================================
const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// 🔍 1. BUSCAR TODOS OS PRODUTOS (GET /api/produtos)
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (erro) {
        next(erro);
    }
});

// 🔍 2. BUSCAR UM PRODUTO ESPECÍFICO POR ID (GET /api/produtos/:id)
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const produtoId = parseInt(id);
        
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', produtoId)
            .single();

        if (error) {
            console.error('Erro ao buscar produto:', error);
            return res.status(404).json({ 
                sucesso: false,
                error: "Produto não encontrado na loja." 
            });
        }

        if (!data) {
            return res.status(404).json({ 
                sucesso: false,
                error: "Produto não encontrado." 
            });
        }

        res.json(data);
    } catch (erro) {
        console.error('Erro no servidor:', erro);
        next(erro);
    }
});

// 💾 3. CADASTRAR UM NOVO PRODUTO (POST /api/produtos)
router.post('/', async (req, res, next) => {
    try {
        const { nome, preco, imagem_url, info } = req.body;
        
        console.log('Recebendo dados do produto:', { nome, preco, imagem_url, info });

        if (!nome || !preco) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Por favor, informe o nome e o preço do produto!" 
            });
        }

        const precoNumerico = parseFloat(preco);
        
        const { data, error } = await supabase
            .from('produtos')
            .insert([{ 
                nome, 
                preco: precoNumerico, 
                imagem_url: imagem_url || null, 
                info: info || null 
            }])
            .select();

        if (error) {
            console.error('Erro ao inserir:', error);
            throw error;
        }

        res.status(201).json({
            sucesso: true,
            mensagem: "✨ Produto cadastrado com sucesso!",
            produto: data[0]
        });
    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        next(erro);
    }
});

// 📝 4. ATUALIZAR UM PRODUTO (PUT /api/produtos/:id)
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, preco, imagem_url, info } = req.body;
        
        const produtoId = parseInt(id);

        const { data, error } = await supabase
            .from('produtos')
            .update({ nome, preco, imagem_url, info })
            .eq('id', produtoId)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado para atualização."
            });
        }

        res.json({
            sucesso: true,
            mensagem: "📝 Produto atualizado com sucesso!",
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
        const produtoId = parseInt(id);

        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', produtoId);

        if (error) {
            throw error;
        }

        res.json({ 
            sucesso: true, 
            mensagem: `🗑️ Produto #${id} removido com sucesso!` 
        });
    } catch (erro) {
        next(erro);
    }
});

module.exports = router;
