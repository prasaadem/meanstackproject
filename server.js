var express = require('express'); //Express Setup
var app = express();
var port = process.env.PORT|| 3000; //Port
var morgan = require('morgan'); //Command Prompt Logging of request to server
var mongoose = require('mongoose'); //MongoDB 
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var bodyParser = require('body-parser'); //To parse the request
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);

//Connect to Database and Check for any error conditions
mongoose.connect('mongodb://aditya:Cnsape@2923@ds019633.mlab.com:19633/pld',function(err){
    if (err){
        console.log('Not connected to the database: ' + err);
    }
    else{
        console.log('Connected to the MongoDB successfully!');
    }
});

//Routes
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})
//Listening for server on port
app.listen(port,function(){
    console.log('Server running on port: '+ port);
});

