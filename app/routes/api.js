    var express = require('express');
    var User = require('../models/user'); //User Model
    var Course = require('../models/course'); //Course Model
    var Assignment = require('../models/assignment'); //Course Model
    var Semester = require('../models/semester'); //Semester Model
    var Submission = require('../models/submission');
    var jwt = require('jsonwebtoken');
    var path = require('path');     //used for file path
    var secret = 'pld';
    var fs = require('fs');
    var multer = require('multer');
    var async = require('async');

    var semester = {};
    var finalSemesters = new Array();
    var finalCourses = new Array();
    var adminCourses = new Array();
    


    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        console.log(req.decoded.user);
        cb(null, './app/uploads/');
    },
    filename: function (req, file, cb) {
        if(!file.originalname.match(/\.(pdf|doc|docx)$/)){
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        }else{
            cb(null, Date.now() + '_' + file.originalname );
        }
    }
    });

    var upload = multer({ 
        storage: storage,
        limits: { fileSize: 10000000 } 
    }).single('myfile');

    module.exports = function(router){

        router.post('/users',function(req,res){
            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;
            user.name = req.body.name;
            user.email = req.body.email;
            user.courses = req.body.courses;
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

        router.post('/sem',function(req,res){
            var sem = new Semester();
            sem.title = req.body.semTitle;
            sem.startDate = req.body.startDate;
            sem.endDate = req.body.endDate;
            var directoryPath = path.join(__dirname + '/../uploads/' +sem.title);

            if (fs.existsSync(directoryPath)) {
                res.json({
                    success: false,
                    message: 'Semester Folder already exists'
                });
            }else{
                if(req.body.semTitle == null || req.body.semTitle == "" || req.body.startDate == null || req.body.startDate == "" || req.body.endDate == null || req.body.endDate == ""){
                    res.json({
                        success: false,
                        message: 'Enter all required information'
                    });
                }else{
                    sem.save(function(err){
                        if (err){
                            if (err.errors != null) {
                                if (err.errors.semTitle) {
                                    res.json({
                                        success: false,
                                        message: err.errors.semTitle.message
                                    }); 
                                }else if (err.errors.startDate) {
                                    res.json({
                                        success: false,
                                        message: err.errors.startDate.message
                                    }); 
                                }else if (err.errors.endDate) {
                                    res.json({
                                        success: false,
                                        message: err.errors.endDate.message
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
                                        message: 'Semester is already there!'
                                    });
                                }else{
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } 
                            }
                        }else{
                            fs.mkdir(directoryPath, function(err){
                                if (err) throw err;
                            });
                            res.json({
                                success: true,
                                message: 'Semester Created!'
                            });        
                        }
                    });
                }
            }
        });

        router.post('/course',function(req,res){
            var course = new Course();
            course.title = req.body.title;
            course.name = req.body.name;
            course.semester = req.body.semester._id;
            course.available = false;
            course.assignments = new Array();
            course.students = new Array();
            course.faculty = '';

            Semester.findOne({_id: req.body.semester._id}).select('title').exec(function(err,semester){
                var directoryPath = path.join(__dirname + '/../uploads/'+ semester.title +'/' + course.title);
                if (fs.existsSync(directoryPath)) {
                    res.json({
                        success: false,
                        message: 'Course Folder already exists'
                    });
                }else{
                    if(req.body.title == null || req.body.title == "" || req.body.name == null || req.body.name == "" || req.body.semester == null || req.body.semester == ""){
                        res.json({
                            success: false,
                            message: 'Enter all required information'
                        });
                    }else{
                        course.save(function(err){
                            if (err){
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }else{
                                fs.mkdir(directoryPath, function(err){
                                    if (err) throw err;
                                });
                                res.json({
                                    success: true,
                                    message: 'Course Created!'
                                });        
                            }
                        });
                    }
                }
            });
        });

        router.post('/checkusername',function(req,res){
            User.findOne({username: req.body.username}).select('username').exec(function(err,user){
                if (err) throw err;

                if (user) {
                    res.json({success:false, message: 'That username is already taken'});
                }else{
                    res.json({success:false, message: 'Username is available'});
                }
            });
        });

        router.post('/checkemail',function(req,res){
            User.findOne({email: req.body.email}).select('email').exec(function(err,user){
                if (err) throw err;

                if (user) {
                    res.json({success:false, message: 'That e-mail is already taken'});
                }else{
                    res.json({success:false, message: 'e-mail is available'});
                }
            });
        });

        //http://localhost:PORT/api/authenticate
        //User login route
        router.post('/authenticate',function(req,res){
            User.findOne({username: req.body.username}).select('email username password courses').exec(function(err,user){
                if (err) throw err;

                if (!user) {
                    res.json({success:false, message: 'Could not authenticate user'});
                }else{
                    if (req.body.password) {
                        //var validPassword = user.comparePassword(req.body.password);
                    }else{
                        res.json({success:false, message: 'No password provided'});
                    }
                    //if (!validPassword) {
                      //  res.json({success:false, message: 'Could not authenticate password'});
                    //}else{
                        var token = jwt.sign({
                            user: user,
                            username: user.username,
                            email: user.email,
                            courses: user.courses
                        }, secret, {
                            expiresIn: '24h'
                        });
                        res.json({
                            success: true,
                            message: 'User Validated!',
                            token: token
                        }); 
                    //}
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

        router.get('/renewToken/:username', function(req,res){
            User.findOne({username: req.params.username}).select().exec(function(err,user){
                if (err) throw err;
                if (!user) {
                    res.json({success:false, message: 'No user found'});
                }else{
                    var newToken = jwt.sign({
                        user: user,
                        username: user.username,
                        email: user.email,
                        courses:user.courses
                    }, secret, {
                        expiresIn: '24h'
                    });
                    res.json({
                        success: true,
                        token: newToken
                    }); 
                }
            });
        });

        router.get('/permission',function(req,res){
            User.findOne({username: req.decoded.username}, function(err,user){
                if (err) throw err;
                if (!user) {
                    res.json({success:false, message: 'No user found'});
                }else{
                    res.json({success:true, permission: user.permission});
                }
            });
        });

        router.get('/management',function(req,res){
            User.find({}, function(err,users){
                if (err) throw err;
                User.findOne({ username: req.decoded.username }, function(err,mainUser){
                    if (err) throw err;
                    if (!mainUser) {
                        res.json({success:false, message: 'No user found'});
                    }else{
                        if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                            if (!users) {
                                res.json({success:false, message: 'No users found'});
                            }else{
                                res.json({success:true, users:users, permission:mainUser.permission});
                            }
                        }else{
                            res.json({success:false, message: 'Insufficient Permissions'});
                        }
                    }
                });
            });
        });

        // Route to delete a user
        router.delete('/management/:username', function(req, res) {
            var deletedUser = req.params.username; // Assign the username from request parameters to a variable
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) {
                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                } else {
                    // Check if current user was found in database
                    if (!mainUser) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        // Check if curent user has admin access
                        if (mainUser.permission !== 'admin') {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        } else {
                            // Fine the user that needs to be deleted
                            User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                                if (err) {

                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    res.json({ success: true }); // Return success status
                                }
                            });
                        }
                    }
                }
            });
        });

        // Route to get the user that needs to be edited
        router.get('/edit/:id', function(req, res) {
            var editUser = req.params.id; // Assign the _id from parameters to variable
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) {
                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                } else {
                    // Check if logged in user was found in database
                    if (!mainUser) {
                        res.json({ success: false, message: 'No user found' }); // Return error
                    } else {
                        // Check if logged in user has editing privileges
                        if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                            // Find the user to be editted
                            User.findOne({ _id: editUser }, function(err, user) {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                } else {
                                    // Check if user to edit is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        res.json({ success: true, user: user }); // Return the user to be editted
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                        }
                    }
                }
            });
        });


            router.post('/takeCourse', function(req, res) {
console.log(req.body.course);
                User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                    } else {
                        if (!mainUser) {
                            res.json({ success: false, message: "no user found" });
                        }else{
                            if (mainUser.permission === 'faculty') {
                                Course.findOne({_id:req.body.course._id},function(err,course){
                                    console.log(course);
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                    } else {
                                        if (!course) {
                                            res.json({ success: false, message: 'Course not found' });
                                        }else{
                                            if (course.faculty === '') {
                                                course.faculty = mainUser._id;
                                                course.available = true;
                                                course.save(function(err) {
                                                    if (err) {
                                                        console.log(err); // Log any errors to the console
                                                    } else {
                                                        mainUser.courses.push(course._id);
                                                        mainUser.save(function(err) {
                                                            if (err) {
                                                                console.log(err); // Log any errors to the console
                                                            } else {
                                                                res.json({ success: true, message: 'Course has been updated!' }); // Return success message
                                                            }
                                                        });
                                                    }
                                                });
                                            }else{
                                                res.json({ success: false, message: 'Course is already taken' });
                                            }
                                        }
                                    }
                                });
                            }else if (mainUser.permission === 'student') {
                                Course.findOne({_id: req.body.course._id},function(err,course){
                                    if(err) throw err;
                                    if(!course){
                                        res.json({success: false, message: 'Course not found'});
                                    }else{
                                        if (course.available === false) 
                                            {
                                                res.json({ success: false, message: 'Course is not available' });
                                            }else
                                            {
                                                course.students.push(mainUser._id);
                                                course.save(function(err) 
                                                {
                                                    if (err) 
                                                    {
                                                        console.log(err); // Log any errors to the console
                                                    } else 
                                                    {
                                                        mainUser.courses.push(course._id);
                                                        mainUser.save(function(err) 
                                                        {
                                                            if (err) 
                                                            {
                                                                console.log(err); // Log any errors to the console
                                                            } else 
                                                            {
                                                                res.json({ success: true, message: 'Course Registered!' }); // Return success message
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                    }
                                });
                            }
                        }
                    }
                });
        });


        // Route to update/edit a user
        router.put('/edit', function(req, res) {
            var editUser = req.body._id; // Assign _id from user to be editted to a variable
            if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
            if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
            if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
            if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
            // Look for logged in user in database to check if have appropriate access
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) {
                    res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                } else {
                    // Check if logged in user is found in database
                    if (!mainUser) {
                        res.json({ success: false, message: "no user found" }); // Return error
                    } else {
                        // Check if a change to name was requested
                        if (newName) {
                            // Check if person making changes has appropriate access
                            if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                                // Look for user in database
                                User.findOne({ _id: editUser }, function(err, user) {
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                    } else {
                                        // Check if user is in database
                                        if (!user) {
                                            res.json({ success: false, message: 'No user found' }); // Return error
                                        } else {
                                            user.name = newName; // Assign new name to user in database
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log any errors to the console
                                                } else {
                                                    res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                            }
                        }

                        // Check if a change to username was requested
                        if (newUsername) {
                            // Check if person making changes has appropriate access
                            if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                                // Look for user in database
                                User.findOne({ _id: editUser }, function(err, user) {
                                    if (err) {

                                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                    } else {
                                        // Check if user is in database
                                        if (!user) {
                                            res.json({ success: false, message: 'No user found' }); // Return error
                                        } else {
                                            user.username = newUsername; // Save new username to user in database
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log error to console
                                                } else {
                                                    res.json({ success: true, message: 'Username has been updated' }); // Return success
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                            }
                        }

                        // Check if change to e-mail was requested
                        if (newEmail) {
                            // Check if person making changes has appropriate access
                            if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                                // Look for user that needs to be editted
                                User.findOne({ _id: editUser }, function(err, user) {
                                    if (err) {

                                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                    } else {
                                        // Check if logged in user is in database
                                        if (!user) {
                                            res.json({ success: false, message: 'No user found' }); // Return error
                                        } else {
                                            user.email = newEmail; // Assign new e-mail to user in databse
                                            // Save changes
                                            user.save(function(err) {
                                                if (err) {
                                                    console.log(err); // Log error to console
                                                } else {
                                                    res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                            }
                        }

                        // Check if a change to permission was requested
                        if (newPermission) {
                            // Check if user making changes has appropriate access
                            if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                                // Look for user to edit in database
                                User.findOne({ _id: editUser }, function(err, user) {
                                    if (err) {

                                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                                    } else {
                                        // Check if user is found in database
                                        if (!user) {
                                            res.json({ success: false, message: 'No user found' }); // Return error
                                        } else {
                                            // Check if attempting to set the 'user' permission
                                            if (newPermission === 'user') {
                                                // Check the current permission is an admin
                                                if (user.permission === 'admin') {
                                                    // Check if user making changes has access
                                                    if (mainUser.permission !== 'admin') {
                                                        res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error
                                                    } else {
                                                        user.permission = newPermission; // Assign new permission to user
                                                        // Save changes
                                                        user.save(function(err) {
                                                            if (err) {
                                                                console.log(err); // Long error to console
                                                            } else {
                                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    user.permission = newPermission; // Assign new permission to user
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); // Log error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            }
                                            // Check if attempting to set the 'faculty' permission
                                            if (newPermission === 'faculty') {
                                                // Check if the current permission is 'admin'
                                                if (user.permission === 'admin') {
                                                    // Check if user making changes has access
                                                    if (mainUser.permission !== 'admin') {
                                                        res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); // Return error
                                                    } else {
                                                        user.permission = newPermission; // Assign new permission
                                                        // Save changes
                                                        user.save(function(err) {
                                                            if (err) {
                                                                console.log(err); // Log error to console
                                                            } else {
                                                                res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    user.permission = newPermission; // Assign new permssion
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); // Log error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            }

                                            // Check if assigning the 'admin' permission
                                            if (newPermission === 'admin') {
                                                // Check if logged in user has access
                                                if (mainUser.permission === 'admin') {
                                                    user.permission = newPermission; // Assign new permission
                                                    // Save changes
                                                    user.save(function(err) {
                                                        if (err) {
                                                            console.log(err); // Log error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                } else {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); // Return error
                                                }
                                            }
                                        }
                                    }
                                });
    } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                            }
                        }
                    }
                }
            });
    });

    router.get('/getSems',function(req,res){
        Semester.find({}, function(err,sems){
            if (err){
                res.json({success:false, message: err});
            }else{
                res.json({success:true, sems:sems});
            }
        });
    });

    router.get('/getCourseFromId/:id',function(req,res){
        console.log(req.params.id);

        Course.findOne({_id:req.params.id}, function(err,course){
            console.log(course);
            if (err){
                res.json({success:false, message: err});
            }else{
                if (!course) {
                    res.json({success:false, message: 'No course found'});
                }else{
                }
            }
        });
    });
 router.get('/getAdminCourses',function(req,res){
        Course.find(function(err,courses){
            if (err) throw err;
            if (!courses) {
                res.json({success:false, message: 'Courses not found'});
            }else{
                res.json({success:true, courses:courses});
            }
        });
    });
   

    // router.get('/getAdminCourses',function(req,res){
    //     Course.find().populate(semester).exec(function(err,courses){
    //         console.log(courses);
    //     });
    //     res.json({success:true});
    // });

    router.get('/getFacultyCourses',function(req,res){
        var courses = Course.find({faculty: req.decoded.user._id}).toArray();

        courses.forEach(function(course){
            Semester.findOne({_id:course.semester},function(err,sem){
                if (err){
                    res.json({success:false, message: err});
                }else{
                    if (!sem) {
                        res.json({success:false, message: 'No Semester found'});
                    }else{
                        semester = {};
                        semester.course = course;
                        semester.title = sem.title;
                        semester.startDate = sem.startDate;
                        semester.endDate = sem.endDate;   
                        finalSemesters.push(semester);
                    }
                }
            });
        });
        console.log(finalSemesters);
        res.json({success:true, courses:courses, semesters:finalSemesters});
    });

    router.get('/getStudentCourses',function(req,res){
        User.findOne({_id:req.decoded.user._id}, function(err,user){
            if (err) throw err;
            if (!user) {
                res.json({success:false, message:'User not found'});
            }else{
                if (user.permission === 'student') {
                    for(var i = 0; i<user.courses.length;i++){
                        Course.findOne({_id:user.courses[i]},function(err,course){
                            if (err) throw err;
                            if (!course) {
                                res.json({success:false, message:'Course not found'});
                            }else{
                                console.log(course);
                                finalCourses.push(course);
                            }
                        });
                    }
                    res.json({success:true, courses:finalCourses});
                }
            }
        });





        // User.findOne({_id:req.decoded.user._id}, function(err,user){
        //     if (err) throw err;
        //     if (!user) {
        //         res.json({success:false, message:'No User found'});
        //     }else{
        //         if (user.permission === 'student') {
        //             user.courses.forEach(function(course_id){
        //                 Course.findOne({_id:course_id},function(err,course){
        //                     if (err) throw err;
        //                     if (!course) {
        //                         res.json({success:false, message:'No Course found'});
        //                     }else{
        //                         dict  ={};
        //                         dict._id = course_id;
        //                         dict.course = course;
        //                         studentCourses.push(dict);
        //                         console.log(studentCourses);
        //                     }
        //                 });
        //             });  
        //             res.json({success:true, courses:studentCourses});
        //         }
        //     }
        // });
    });

    router.get('/getFacultyAssignmentsForCourseId',function(req,res){
        Assignment.find({faculty: req.decoded.user._id}).exec(function(err,assignments){
            if (err) throw err;
            if (!assignments) {
                res.json({success:false, message: 'No assignments to display'});
            }else{
                res.json({success:true, assignments:assignments});
            }
        });
    });

    router.post('/createAssignment',function(req,res){

      //   name: {type: String, required:true},
      // startDate: {type: Date, default: Date.now},
      // dueDate: {type: Date, default: Date.now},
      // faculty:{type: String, required:true},
      // course:{type:String, required:true},
      // submissions:{type:Array}

      console.log(req);
      var assignment = new Assignment();
      assignment.name = req.body.name;
      assignment.course = req.body.course._id;
      assignment.faculty = req.body.course.faculty;
      assignment.startDate = req.body.startDate;
      assignment.dueDate = req.body.dueDate;
      assignment.submissions = new Array();

    if(req.body.course == null || req.body.course == "" || req.body.name == null || req.body.name == "" || req.body.startDate == null || req.body.startDate == "" || req.body.dueDate == null || req.body.dueDate == ""){
        res.json({
            success: false,
            message: 'Enter all required information'
        });
    }else{
        assignment.save(function(err){
            if (err){
                res.json({
                    success: false,
                    message: err
                });
            }else{
                Course.findOne({_id:req.body.course._id},function(err,course){
                    console.log(course);
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                    } else {
                        if (!course) {
                            res.json({ success: false, message: 'Course not found' });
                        }else{
                            course.assignments.push(assignment._id);
                            course.save(function(err){
                                if (err) {
                                    throw err;
                                }else{
                                    res.json({
                                        success: true,
                                        message: 'Assignment Created!',
                                        assignment: assignment
                                    }); 
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    });

    router.post('/getAssignmentsForCourse',function(req,res){
        Assignment.find({course:req.body.course._id}).exec(function(err,assignments){
            if (err) throw err;
            if (!assignments) {
                res.json({success:false, message: 'No assignments to display'});
            }else{
                res.json({success:true, assignments: assignments});
            }
        });
    });

    router.post('/upload', function (req, res) {
        upload(req, res, function (err) {
            if (err) {
              if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({success:false, message: 'File size is too large. Max limit is 10MB'});
            }else if(err.code === 'filetype'){
                res.json({success:false, message: 'Invalid file type'});
            }else{
                res.json({success:false, message: err});
            }
        }else{
            if (!req.file) {
                res.json({success:false, message: 'No file was selected'});
            }else{
                res.json({success:true, message: 'File was uploaded!'});
            }
        }
    });
    });

        // router.put('/setAssignmentForCourse', function(req, res) {
        //     if (req.body.assignment) var newAssignment = new Assignment();
        //     newAssignment = req.body.assignment;
        //     console.log(newAssignment);
        // });

        return router;
    }