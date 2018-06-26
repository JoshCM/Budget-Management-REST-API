module.exports = (app) => {
    const account = require('../controllers/account.controller.js');

    var passport = require('passport');
    require('../../config/passport')(passport);


    // LOGIN
    app.post('/api/auth/login', account.handleLogin);
    // REGISTER
    app.post('/api/auth/register', account.handleRegsitration);

    app.get('/allAccounts', account.getall);

    app.get('/totals/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}) , account.getTotalsByDate )

    app.get('/expenseDates/:userEmail', passport.authenticate('jwt', { session: false}) , account.getExpensesDates);

    app.get('/singleMaxIncome/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}) , account.getSingleMaxIncome);

    app.get('/singleMaxExpense/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}) , account.getSingleMaxExpense);

    app.get('/expenses/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}) , account.getExpensesByDate);

    app.get('/expenseDates/:userEmail', passport.authenticate('jwt', { session: false}), account.getExpensesDates);

    app.get('/incomeDates/:userEmail', passport.authenticate('jwt', { session: false}), account.getIncomeDates);

    app.get('/expenses/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}), account.getExpensesByDate);

    app.get('/incomes/:userEmail/:month/:year', passport.authenticate('jwt', { session: false}), account.getIncomesByDate);

    //PUT
    app.put('/incomes/:userEmail', passport.authenticate('jwt', { session: false}) , account.addIncome);

    app.put('/expenses/:userEmail', passport.authenticate('jwt', { session: false}), account.addExpens);

    //DELETE
    app.delete('/expenses/:userEmail/:expenseId',passport.authenticate('jwt', { session: false}),account.removeExpense);

    app.delete('/incomes/:userEmail/:incomeId',passport.authenticate('jwt', { session: false}),account.removeIncome);

    app.delete('/accounts/:userEmail',passport.authenticate('jwt', { session: false}),account.deleteAccount);
}
