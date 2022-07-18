const mongoose = require("mongoose")
const { Schema } = mongoose;

const Userschema = new Schema({
    firstname:{
        type: String,
        default: null
    },
    lastname:{
        type: String,
        default: null
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String
    },
    token: {
        type: String
    },

});

module.exports = mongoose.model('user' , Userschema );