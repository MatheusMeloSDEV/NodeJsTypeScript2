const express = require('express');
const router = express.Router()
module.exports = router;
const modeloAdmin = require('../models/admin');

router.get('/getUsers', async (req, res) => {
    try {
        const resultados = await modeloAdmin.find();
        res.json(resultados)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/adminPost', async (req, res) => {
    const objetoAdmin = new modeloAdmin({
        nome: req.body.nome,
        senha: req.body.senha
    })

    try {
        const AdminSalva = await objetoAdmin.save();
        res.status(200).json(AdminSalva)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/adminDelete/:id', async (req, res) => {
    try {
        const resultado = await modeloAdmin.findByIdAndDelete(req.params.id)

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/adminUpdate/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const novaAdmin = req.body;
        const options = { new: true };
        const result = await modeloAdmin.findByIdAndUpdate(
            id, novaAdmin, options
        )
        res.json(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})