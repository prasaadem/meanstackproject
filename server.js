var express = require('express'); //Express Setup
var app = express();
var port = process.env.PORT|| 3000; //Port
var morgan = require('morgan'); //Command Prompt Logging of request to server
var mongoose = require('mongoose'); //MongoDB 
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var bodyParser = require('body-parser'); //To parse the request

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/api',appRoutes);

//Connect to Database and Check for any error conditions
mongoose.connect('mongodb://localhost:27017/meanstackproject',function(err){
    if (err){
        console.log('Not connected to the database: ' + err);
    }
    else{
        console.log('Connected to the MongoDB successfully!');
    }
});

//Routes

//Listening for server on port
app.listen(port,function(){
    console.log('Server running on port: '+ port);
});

