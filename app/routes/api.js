var User = require('../models/user'); //User Model
var jwt = require('jsonwebtoken');
var secret = 'pld';

module.exports = function(router){

    //http://localhost:PORT/api/users
    //User Registration Route
    router.post('/users',function(req,res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        if(req.body.name == null || req.body.name == "" || req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == ""){
            res.json({
                success: false,
                message: 'Enter all required information'
            });
        }else{
            user.save(function(err){
                if (err){
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            }); 
                        }else if (err.errors.email) {
                            res.json({
                                success: false,
                                message: err.errors.email.message
                            }); 
                        }else if (err.errors.username) {
                            res.json({
                                success: false,
                                message: err.errors.username.message
                            }); 
                        }else if (err.errors.password) {
                            res.json({
                                success: false,
                                message: err.errors.password.message
                            }); 
                        }else{
                            res.json({
                                success: false,
                                message: err
                            }); 
                    }
                    }else if(err){
                        if (err.code == 11000) {
                            res.json({
                            success: false,
                            message: 'username or email is already taken!'
                        });
                        }else{
                            res.json({
                            success: false,
                            message: err
                        });
                        } 
                    }
                }else{
                    res.json({
                        success: true,
                        message: 'User Created!'
                    });        
                }
            });
        }
    });

    //http://localhost:PORT/api/authenticate
    //User login route
    router.post('/authenticate',function(req,res){
        User.findOne({username: req.body.username}).select('email username password').exec(function(err,user){
            if (err) throw err;

            if (!user) {
                res.json({success:false, message: 'Could not authenticate user'});
            }else{
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                }else{
                    res.json({success:false, message: 'No password provided'});
                }
                if (!validPassword) {
                    res.json({success:false, message: 'Could not authenticate password'});
                }else{
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email
                    }, secret, {
                        expiresIn: '24h'
                    });
                    res.json({
                        success: true,
                        message: 'User Validated!',
                        token: token
                    }); 
                }
            }
        });
    });

    router.use(function(req,res,next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token,secret,function(err,decoded){
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                }else{
                    req.decoded = decoded;
                    next();
                }
            });
        }else{
            res.json({
                        success: false,
                        message: 'No token provided'
                    }); 
        }
    });

    router.post('/me',function(req,res){
        res.send(req.decoded);
    });

    return router;
}