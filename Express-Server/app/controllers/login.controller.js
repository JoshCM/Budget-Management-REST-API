const Account = require('../models/account.model.js');

exports.login = (req, res) => {
    if (!req.body.Email) {
        return res.status(400).send({
            message: "userName cannot be Empty"
        });
    }

    Account.findOne({ Email: req.body.Email }, function (err, account) {
        if(account){
            if (account.Password == req.body.Password) {
                return res.send({
                    login: true
                });
            } else {
                return res.send({
                    login: false
                });
            }
        }else{
            return res.status(404).send({
                message:err.message
            });
        }
    });



}