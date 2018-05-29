const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    Name:String,
    Nachname:String,
    Alter:Number,
    Email:String,

},{
    timestamps:true
});

module.exports = mongoose.model('User',UserSchema);