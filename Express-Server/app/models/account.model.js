const mongoose = require('mongoose');

const Expense = mongoose.Schema({
    Title:String,
    Categorie:String,
    Amount:Number,
    Date:Date
});

const Income = mongoose.Schema({
    Title:String,
    Categorie:String,
    Amount:Number,
    Date:Date
});

const AccountSchema = mongoose.Schema({
    Name:{FirstName:String,LastName:String},
    Email:String,
    Password:String,
    Expenses:[Expense],
    Income:[Income],
    SuperUser:Boolean
},{
    timestamps:true
});

module.exports = mongoose.model('Account',AccountSchema);