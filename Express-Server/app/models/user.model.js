const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

const UserSchema = mongoose.Schema({
    Name:String,
    Nachname:String,
    Email:String,
    Projects:[ObjectId],
    SuperUser:Boolean
},{
    timestamps:true
});

module.exports = mongoose.model('User',UserSchema);