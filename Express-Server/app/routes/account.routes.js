module.exports = (app) => {
    const account = require('../controllers/account.controller.js');
    //POST
    app.post('/accounts',account.create);

    
    //GET
    app.get('/accounts',account.findAll);

    app.get('/expenseDates/:userEmail',account.getExpensesDates);
    app.get('/incomeDates/:userEmail',account.getIncomeDates);
    /*
    
    app.get('/expenses/:userEmail/:month/:year',account.getExpensesByDate);

    app.get('/incomes/:userEmail/:month/:year',account.getIncomesByDate);
*/

    //PUT
    app.put('/incomes/:userEmail',account.addIncome);

    app.put('/expenses/:userEmail',account.addExpens);

/*
    //DELETE
    app.delete('/expenses/:userEmail/:expenseId',account.removeExpense);

    app.delete('/expenses/:userEmail/:expenseId',account.removeIncome);

    app.delete('/accounts/:userEmail',account.deleteAccount);
    */
}
