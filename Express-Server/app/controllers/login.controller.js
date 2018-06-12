const Users = require('../models/user.model.js');

exports.login = (req, res) => {
    if (!req.body.Email) {
        return res.status(400).send({
            message: "userName cannot be Empty"
        });
    }

    Users.findOne({ Email: req.body.Email }, function (err, docs) {
        user = docs;
        if(user){
            if (user.Nachname == req.body.Pass) {
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
                message:"User not found"
            });
        }
    });



}