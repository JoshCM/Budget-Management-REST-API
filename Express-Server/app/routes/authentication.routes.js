module.exports = (app) => {
    const authentication = require('../controllers/login.controller.js');

    app.post('/login',authentication.login);

}