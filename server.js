var express = require('express'); //Express Setup
var app = express();
var port = process.env.PORT|| 3000; //Port
var morgan = require('morgan'); //Command Prompt Logging of request to server
var mongoose = require('mongoose'); //MongoDB 
var User = require('./app/models/user'); //User Model

var bodyParser = require('body-parser'); //To parse the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(morgan('dev'));

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
app.post('/users',function(req,res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == ""){
        res.send('Enter all required information');
    }else{
        user.save(function(err){
        if (err){
            res.send('Username or email already exits!');    
        }else{
            res.send('User Created!');        
        }
    });
    }
});

//Listening for server on port
app.listen(port,function(){
    console.log('Server running on port: '+ port);
});

