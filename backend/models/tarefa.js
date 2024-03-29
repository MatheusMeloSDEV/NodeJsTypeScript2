const mongoose = require('mongoose');
const schemaTarefa = new mongoose.Schema({
    descricao: {
        required: true,
        type: String
    },
    statusRealizada: {
        required: true,
        type: Boolean
    },
},
    {
        versionKey: false
    }
)
schemaTarefa.index({descricao:"text"})
module.exports = mongoose.model('tarefas', schemaTarefa)