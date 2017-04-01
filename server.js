var express = require('express'); //Express Setup
var app = express();
var port = process.env.PORT|| 3000; //Port
var morgan = require('morgan'); //Command Prompt Logging of request to server
var mongoose = require('mongoose'); //MongoDB 

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
app.get('/home',function(req,res){
    res.send('Welcome Home');
})

//Listening for server on port
app.listen(port,function(){
    console.log('Server running on port: '+ port);
});

