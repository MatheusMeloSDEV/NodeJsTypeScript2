const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');
const userModel = require('../models/admin');


const undo = []


router.post('/post', async (req, res) => {
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,
        statusRealizada: req.body.statusRealizada
    })

    try {
        const tarefaSalva = await objetoTarefa.save();
        undo.push(objetoTarefa)
        res.status(200).json(tarefaSalva)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/getAll', verificaJWT, async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id)

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const novaTarefa = req.body;
        const options = { new: true };
        const result = await modeloTarefa.findByIdAndUpdate(
            id, novaTarefa, options
        )
        res.json(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/search/:s', async (req, res) => {
    try {
        const param = req.params.s;

        const resultado = await modeloTarefa.find({ $text: { $search: param } })

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/deleteAll', async (req, res) => {
    try {

        const resultado = await modeloTarefa.deleteMany()

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/deleteAllDone', async (req, res) => {
    try {

        const resultado = await modeloTarefa.deleteMany({ statusRealizada: true })

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/undo', async (req, res) => {
    try {


        const resultado = await modeloTarefa.findByIdAndDelete(undo[0]._id)

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/undo', async (req, res) => {
    try {

        const array = []
        undo.forEach(async (item, index) => {

            const objetoTarefa = new modeloTarefa({
                descricao: item.descricao,
                statusRealizada: item.statusRealizada
            })
            console.log(objetoTarefa)
             resultado = await objetoTarefa.save()
             array.push(resultado)
        })
        res.json(resultado)

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//Autenticacao
var jwt = require('jsonwebtoken');
router.post('/login', async (req, res) => {
 try {
 const data = await userModel.findOne({ 'nome': req.body.nome });
 
 if (data!=null && validPassword(req.body.senha, data.hash, data.salt)) {
 const token = jwt.sign({ id: req.body.user }, 'segredo',
 { expiresIn: 300 });
 return res.json({ token: token });
 }
 
 res.status(500).json({ message: 'Login invalido!' });
 } catch (error) {
 res.status(500).json({ message: error.message })
 }
})


//Autorizacao
function verificaUsuarioSenha(req, res, next) {
    if (req.body.nome !== 'branqs' || req.body.senha !== '1234') {
    return res.status(401).json({ auth: false, message: 'Usuario ou Senha incorreta' });
    }
    next();
   }
   

   //Nova forma de Autorizacao
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({
    auth: false, message: 'Token nao fornecido'
    });
    jwt.verify(token,'segredo', function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha !' });
    next();
    });
   }
   
   var { createHash } = require('crypto');
   function validPassword (senha, hashBD, saltBD) {
    hashCalculado=createHash('sha256').update(senha+saltBD).digest('hex');
    return hashCalculado === hashBD;
   };