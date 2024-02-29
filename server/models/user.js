const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email:{
    type : String,
    required : true
    } ,
    password:{
        type : String,
        required : true
    } ,
    date :{
        type: Date,
        default : Date.now
    },
    cart :{
        type : Array,
        default : []
    },
    balance :{
        type : Array,
    },
    card :{
        type : Number,
    },
    icon :{
        type : String,
    },
    quantity :{
        type : Array
    }
},{collection : 'Players'});
const User= mongoose.model('User',UserSchema);

module.exports = User;