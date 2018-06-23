const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

const ProjectSchema = mongoose.Schema({
    Title:String,
    Goals:[{Description:String,Date:Date}],
    Expenses:[{Title:String,Amount:Number,Date:Date}],
    Revenue:[{Title:String,Amount:Number,Date:Date}],
    Users:[ObjectId]
},{
    timestamps:true
});

const CalendarSchema = mongoose.Schema({
        User:[

        ]
})

module.exports = mongoose.model('Project',ProjectSchema);
