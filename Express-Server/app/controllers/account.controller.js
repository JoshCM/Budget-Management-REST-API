
const Account = require('../models/account.model.js');

exports.create = (req, res) => {
    const account = new Account({
        Name:req.body.Name,
        Email:req.body.Email,
        Password:req.body.Password,
        SuperUser:req.body.SuperUser
    });

    account.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while creating the Account"
        });
    });
};

exports.findAll = (req,res) => {
    Account.find()
    .then(account => {
        res.send(account);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving Accounts"
        });
    });
};

exports.getExpensesDates = (req,res) => {
    Account.find({Email:req.params.userEmail}, "Expenses.Date")
    .then(expenses => {
        res.send(expenses);
    }).catch(error => {
        res.status(404).send({
            message: error.message || "Expenses not found."
        });
    });
};

exports.getIncomeDates = (req,res) => {
    Account.find({Email:req.params.userEmail}, "Income.Date")
    .then(expenses => {
        res.send(expenses);
    }).catch(error => {
        res.status(404).send({
            message: error.message || "Incomes not found."
        });
    });
};

exports.addIncome = (req,res) => {
    Account.findOne({Email:req.params.userEmail})
    .then(data => {
        data.Income.push(req.body);
        data.save();
        res.send(data);
    })
    .catch(err=> {
        res.status(404).send({
            message: err.message || "Account not found"
        });
    });
};

exports.addExpens = (req,res) => {
    Account.findOne({Email:req.params.userEmail})
    .then(data => {
        data.Expenses.push(req.body);
        data.save()
        res.send(data);
    })
    .catch(err=> {
        res.status(404).send({
            message: err.message || "Account not found"
        });
    });
};
