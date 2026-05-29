const express = require('express');
const router = express.Router();

const supabase = require('./supabase');


// =============================
// GET TODOS OS PRODUTOS
// =============================

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

    } catch (err) {
        next(err);
    }

});


// =============================
// GET PRODUTO POR ID
// =============================

router.get('/:id', async (req, res, next) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json(data);

    } catch (err) {
        next(err);
    }

});


// =============================
// POST NOVO PRODUTO
// =============================

router.post('/', async (req, res, next) => {

    try {

        const {
            nome,
            preco,
            imagem_url,
            info
        } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome e preço obrigatórios.'
            });
        }

        const { data, error } = await supabase
            .from('produtos')
            .insert([
                {
                    nome,
                    preco,
                    imagem_url,
                    info
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json({
            sucesso: true,
            produto: data[0]
        });

    } catch (err) {
        next(err);
    }

});


// =============================
// PUT PRODUTO
// =============================

router.put('/:id', async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            nome,
            preco,
            imagem_url,
            info
        } = req.body;

        const { data, error } = await supabase
            .from('produtos')
            .update({
                nome,
                preco,
                imagem_url,
                info
            })
            .eq('id', id)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            sucesso: true,
            produto: data[0]
        });

    } catch (err) {
        next(err);
    }

});


// =============================
// DELETE PRODUTO
// =============================

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
            mensagem: 'Produto removido.'
        });

    } catch (err) {
        next(err);
    }

});

module.exports = router;
