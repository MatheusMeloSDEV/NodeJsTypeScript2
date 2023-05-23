const mongoose = require('mongoose');
const schemaAdmin = new mongoose.Schema({
    nome: {
        required: true,
        type: String
    },
    hash: String, 
    salt: String
},
    {
        versionKey: false
    }
)
schemaAdmin.index({nome:"text"})
module.exports = mongoose.model('users', schemaAdmin)