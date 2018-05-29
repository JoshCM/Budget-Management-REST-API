const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url)
.then(()=>{
  console.log("Successfully connected to the Database");
}).catch(err=>{
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
})

app.get('/',(req,res)=> {
  res.json({"message":"Welcome to Out Rest API"})
});

require('./app/routes/user.routes.js')(app);


app.listen(3000,()=>{
  console.log("Server listening on port 3000")
})