const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

const CalendarSchema = mongoose.Schema({
    userID: String,
    years: [{yearName: String,
            months:[{monthName: String,
                    days: [{dayName: String,
                          expenses:[{expenseCategory: String,
                                  expenseDescription: String,
                                  expenseAmount: Number}],
                          income: [{incomeCategory: String,
                                  incomeDescription: String,
                                  incomeAmount: Number}]
                          ]}
                    ]}
            ]}
},{
    timestamps:true
});

module.exports = mongoose.model('Calendar', CalendarSchema);
