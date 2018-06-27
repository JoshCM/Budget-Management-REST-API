module.exports = (app) => {
    const account = require('../controllers/account.controller.js');

    var passport = require('passport');
    require('../../config/passport')(passport);


    // LOGIN
    app.post('/api/auth/login', account.handleLogin);
    // REGISTER
    app.post('/api/auth/register', account.handleRegsitration);

    app.get('/allAccounts', account.getall);

    app.get('/totals/:month/:year', passport.authenticate('jwt', { session: false}) , account.getTotalsByDate )

    app.get('/expenseDates', passport.authenticate('jwt', { session: false}) , account.getExpensesDates);

    app.get('/singleMaxIncome/:month/:year', passport.authenticate('jwt', { session: false}) , account.getSingleMaxIncome);

    app.get('/singleMaxExpense/:month/:year', passport.authenticate('jwt', { session: false}) , account.getSingleMaxExpense);

    app.get('/expenses/:month/:year', passport.authenticate('jwt', { session: false}) , account.getExpensesByDate);

    app.get('/expenseDates', passport.authenticate('jwt', { session: false}), account.getExpensesDates);

    app.get('/incomeDates', passport.authenticate('jwt', { session: false}), account.getIncomeDates);

    app.get('/expenses/:month/:year', passport.authenticate('jwt', { session: false}), account.getExpensesByDate);

    app.get('/incomes/:month/:year', passport.authenticate('jwt', { session: false}), account.getIncomesByDate);

    //PUT
    app.put('/incomes', passport.authenticate('jwt', { session: false}) , account.addIncome);

    app.put('/expenses', passport.authenticate('jwt', { session: false}), account.addExpens);

    //DELETE
    app.delete('/expenses/:expenseId',passport.authenticate('jwt', { session: false}),account.removeExpense);

    app.delete('/incomes/:incomeId',passport.authenticate('jwt', { session: false}),account.removeIncome);

    app.delete('/accounts/close' ,passport.authenticate('jwt', { session: false}),account.deleteAccount);
}
