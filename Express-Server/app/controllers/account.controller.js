
const Account = require('../models/account.model.js');


//POST
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

//GET
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

exports.getExpensesByDate = (req,res)=>{
    Account.find({Email:req.params.userEmail, Expenses:{$elemMatch:{
        Date: {
            $gte: new Date(req.params.year,req.params.month-1,1),
            $lte: new Date(req.params.year,req.params.month-1,31)
            }
        }
    }
    },{_id:0, "Expenses.$":1})
    .then(data => {
        res.send(data[0]);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Expenses"
        })
    })
};

exports.getIncomesByDate = (req,res)=>{
    Account.find({Email:req.params.userEmail, Income:{$elemMatch:{
        Date: {
            $gte: new Date(req.params.year,req.params.month-1,1),
            $lte: new Date(req.params.year,req.params.month-1,31)
            }
        }
    }
    },{_id:0, "Income.$":1})
    .then(data => {
        res.send(data[0]);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Expenses"
        })
    })
};


//PUT
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




