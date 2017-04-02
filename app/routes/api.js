var User = require('../models/user'); //User Model
module.exports = function(router){

    //http://localhost:PORT/api/users
    //User Registration Route
    router.post('/users',function(req,res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if(req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == ""){
            res.json({
                success: false,
                message: 'Enter all required information'
            });
        }else{
            user.save(function(err){
                if (err){
                    res.json({
                        success: false,
                        message: 'Username or email already exits!'
                    });   
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
                    res.json({success:true, message: 'User Validated!'});
                }
            }
        });
    });

    return router;
}