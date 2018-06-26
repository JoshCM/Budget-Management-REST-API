const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

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
    Email:{
          type: String,
          unique: true,
          required: true
        },
    Password:{
          type: String,
          required: true
        },
    Expenses:[Expense],
    Income:[Income],
    SuperUser:Boolean
},{
    timestamps:true
});


AccountSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('Password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.Password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.Password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

AccountSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.Password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account',AccountSchema);
