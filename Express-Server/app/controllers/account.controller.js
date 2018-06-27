
const Account = require('../models/account.model.js');

var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var jwt = require('jsonwebtoken');

// Function to get and extract JWT token.
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.handleLogin = (req, res) => {
  Account.findOne({
    Email: req.body.emailInput
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. Username and Password not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.passwordInput, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret, { expiresIn: '30m' });
          // return the information including token as JSON
          res.status(200).json({success: true, token: "JWT " + token, email: req.body.emailInput});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Username and Password not found.'});
        }
      });
    }
  });
};

exports.handleRegsitration = (req, res) => {
  if (!req.body.emailInput || !req.body.passwordInput) {
    res.status(500).json({success: false, msg: 'Password and Username can not be blank.'});
  } else {
    var newUser = new Account({
      Name:req.body.Name,
      Email: req.body.emailInput,
      Password: req.body.passwordInput,
      SuperUser: false
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(500).json({success: false, msg: 'Email is already taken.'});
      }

      return res.status(201).json({success: true, msg: 'Successfully created new user.'});
    });
  }
};

//GET
exports.findAll = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find()
    .then(account => {
        res.send(account);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retrieving Accounts"
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getExpensesDates = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email}, {_id:0, "Expenses.Date":1})
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getIncomeDates = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email}, {_id:0, "Income.Date":1})
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
        res.status(401).send({
            message: error.message || "Incomes not found."
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getTotalsByDate = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email},
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
      res.status(401).send({
          message: err.message || "Cant find matching Expenses"
      })
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getExpensesByDate = (req,res)=>{
  var token = getToken(req.headers);
  console.log("test exp: " + req.user.Email);
  if (token) {
    Account.find({Email:req.user.Email},
        {_id:1, "Expenses":1})
    .then(data => {
        Expenses = data[0].Expenses;
        response = []
        queryStartDate = new Date(req.params.year,req.params.month,0)
        console.log(Expenses + "\n " + queryStartDate );
        Expenses.map(entr=>{
            //console.log(entr)
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getIncomesByDate = (req,res)=>{
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email},
        {_id:1, "Income":1})
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};
exports.getSingleMaxExpense = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email},
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

exports.getSingleMaxIncome = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.find({Email:req.user.Email},
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

//PUT
exports.addIncome = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.findOne({Email:req.user.Email})
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
  return res.status(201).json({success: true, msg: 'Successfully created new Income.'});
};



exports.addExpens = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.findOne({Email:req.user.Email})
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
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
  return res.status(201).json({success: true, msg: 'Successfully created new Income.'});
};

exports.removeExpense = (req,res) => {
  var token = getToken(req.headers);
  if (token) {

    Account.update({Email:req.user.Email},{$pull:{Expenses:{_id:req.params.expenseId}}})
    .then(data => {
        res.send({
          message: "Deleted successfully"
        })
    })
    .catch(err=> {
        res.status(404).send({
            message: err.message || "Account not found"
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }


}

exports.removeIncome = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.update({Email:req.user.Email},{$pull:{Income:{_id:req.params.incomeId}}})
    .then(data => {
        res.send({
          message: "Deleted successfully"
        })
    })
    .catch(err=> {
        res.status(404).send({
            message: err.message || "Account not found"
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }


}

exports.deleteAccount = (req,res) => {
  var token = getToken(req.headers);
  if (token) {
    Account.findOneAndRemove({Email:req.user.Email})
    .then(data => {
        res.send({
          message: "Deleted successfully"
        })
    })
    .catch(err=> {
        res.status(404).send({
            message: err.message || "Account not found"
        });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }

}

exports.getall = (req,res) => {
  Account.find()
  .then(data => {
    res.send(data);
  })
}
