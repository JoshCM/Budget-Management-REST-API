
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
    Account.find({Email:req.params.userEmail}, {_id:0, "Expenses.Date":1})
    .then(Expenses => {

        Dates = {}
        DateList = Expenses[0];
        DateList.Expenses.map(exp => {
            month = exp.Date.getMonth();
            year = exp.Date.getFullYear();
            if(!Dates[year]){
                Dates[year] = [month];
            }else if (!Dates[year].includes(month)){
                Dates[year].push(month);
            }
        });
        res.send(Dates);

    }).catch(error => {
        res.status(404).send({
            message: error.message || "Incomes not found."
        });
    });
};

exports.getIncomeDates = (req,res) => {
    Account.find({Email:req.params.userEmail}, {_id:0, "Income.Date":1})
    .then(Incomes => {

        Dates = {}
        DateList = Incomes[0];
        DateList.Income.map(inc => {
            month = inc.Date.getMonth();
            year = inc.Date.getFullYear();
            if(!Dates[year]){
                Dates[year] = [month];
            }else if (!Dates[year].includes(month)){
                Dates[year].push(month);
            }
        });
        res.send(Dates);

    }).catch(error => {
        res.status(404).send({
            message: error.message || "Incomes not found."
        });
    });
};

exports.getTotalsByDate = (req,res) => {
  Account.find({Email:req.params.userEmail},
      {_id:0, "Expenses":1, "Income": 1})
  .then(data => {
      Expenses = data[0].Expenses;
      Income = data[0].Income;
      ExSum = 0;
      InSum = 0;
      Entries = []
      queryStartDate = new Date(req.params.year,req.params.month,0)

      Income.map(entr=>{
          if(entr.Date != null
              && queryStartDate.getFullYear() == entr.Date.getFullYear()
              && queryStartDate.getMonth() == entr.Date.getMonth()){
              Entries.push(entr.Amount)
          }

      })
      InSum = Entries.reduce((pv, cv) => pv+cv, 0);
      Entries =[]
      Expenses.map(entr=>{
          if(entr.Date != null
              && queryStartDate.getFullYear() == entr.Date.getFullYear()
              && queryStartDate.getMonth() == entr.Date.getMonth()){
              Entries.push(entr.Amount)
          }

      })
      ExSum = Entries.reduce((pv, cv) => pv+cv, 0);

      response = {Expense: ExSum, Income: InSum};

      res.send(response);
  }).catch(err => {
      res.status(404).send({
          message: err.message || "Cant find matching Expenses"
      })
  })
};

exports.getExpensesByDate = (req,res)=>{
    Account.find({Email:req.params.userEmail},
        {_id:0, "Expenses":1})
    .then(data => {
        Expenses = data[0].Expenses;
        response = []
        queryStartDate = new Date(req.params.year,req.params.month,0)

        Expenses.map(entr=>{
            console.log(entr)
            if(entr.Date != null
                && queryStartDate.getFullYear() == entr.Date.getFullYear()
                && queryStartDate.getMonth() == entr.Date.getMonth()){
                response.push(entr)
            }

        })


        res.send(response);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Expenses"
        })
    })
};

exports.getIncomesByDate = (req,res)=>{
    Account.find({Email:req.params.userEmail},
        {_id:0, "Income":1})
    .then(data => {
        Income = data[0].Income;
        response = []
        queryStartDate = new Date(req.params.year,req.params.month,0)

        Income.map(entr=>{
            if(entr.Date != null
                && queryStartDate.getFullYear() == entr.Date.getFullYear()
                && queryStartDate.getMonth() == entr.Date.getMonth()){
                response.push(entr)
            }

        })


        res.send(response);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Income"
        })
    })
};
exports.getSingleMaxExpense = (req,res) => {
    Account.find({Email:req.params.userEmail},
        {_id:0, "Expenses":1})
    .then(data => {
        Expense = data[0].Expenses;
        response = []
        queryStartDate = new Date(req.params.year,req.params.month,0)
        Entry = {Title: "" , Amount: 0}
        Expense.map(entr=>{
            if(entr.Date != null
                && queryStartDate.getFullYear() == entr.Date.getFullYear()
                && queryStartDate.getMonth() == entr.Date.getMonth()){
                if(Entry.Amount < entr.Amount){
                  Entry = {Title: entr.Title, Date: entr.Date, Amount: entr.Amount}
                }
            }

        })


        res.send(Entry);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Income"
        })
    })
};

exports.getSingleMaxIncome = (req,res) => {
    Account.find({Email:req.params.userEmail},
        {_id:0, "Income":1})
    .then(data => {
        Income = data[0].Income;
        response = []
        queryStartDate = new Date(req.params.year,req.params.month,0)
        Entry = {Title: "" , Amount: 0}
        Income.map(entr=>{
            if(entr.Date != null
                && queryStartDate.getFullYear() == entr.Date.getFullYear()
                && queryStartDate.getMonth() == entr.Date.getMonth()){
                if(Entry.Amount < entr.Amount){
                  Entry = {Title: entr.Title, Date: entr.Date, Amount: entr.Amount}
                }
            }

        })


        res.send(Entry);
    }).catch(err => {
        res.status(404).send({
            message: err.message || "Cant find matching Income"
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
