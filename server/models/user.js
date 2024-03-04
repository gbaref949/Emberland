const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
    email:{
    type : String,
    required : true
    } ,
    password:{
        type : String,
        required : true
    } ,
    score :{
        type: Number,
        default : 0,
    },
    bestScore :{
        type : Number,
        default : 0,
    },
    overallScore :{
        type : Number,
        default: 0,
    },
    userID :{
        type : Number,
        default: 0,
    }
},{collection : 'Players'});
const User= mongoose.model('User',UserSchema);

module.exports = User;