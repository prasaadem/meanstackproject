var express = require('express');
var User = require('../models/user'); //User Model
var Course = require('../models/course'); //Course Model
var Assignment = require('../models/assignment'); //Course Model
var Semester = require('../models/semester'); //Semester Model
var Submission = require('../models/submission');
var jwt = require('jsonwebtoken');
var path = require('path'); //used for file path
var secret = 'pld';
var fs = require('fs');
var archiver = require('archiver');
var async = require('async');
var multer = require('multer');
var finalSemesters = new Array();

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './app/uploads/');
//     },
//     filename: function(req, file, cb) {
//         if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
//             var err = new Error();
//             err.code = 'filetype';
//             return cb(err);
//         } else {
//             cb(null, Date.now() + '_' + file.originalname);
//         }
//     }
// });

// var upload = multer({ storage: storage }).single('myfile');

var upload = multer({ dest: './app/uploads/' });

module.exports = function(router) {

    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        user.courses = req.body.courses;
        if (req.body.name == null || req.body.name == "" || req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == "") {
            res.json({
                success: false,
                message: 'Enter all required information'
            });
        } else {
            user.save(function(err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.email) {
                            res.json({
                                success: false,
                                message: err.errors.email.message
                            });
                        } else if (err.errors.username) {
                            res.json({
                                success: false,
                                message: err.errors.username.message
                            });
                        } else if (err.errors.password) {
                            res.json({
                                success: false,
                                message: err.errors.password.message
                            });
                        } else {
                            res.json({
                                success: false,
                                message: err
                            });
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            res.json({
                                success: false,
                                message: 'username or email is already taken!'
                            });
                        } else {
                            res.json({
                                success: false,
                                message: err
                            });
                        }
                    }
                } else {
                    res.json({
                        success: true,
                        message: 'User Created!'
                    });
                }
            });
        }
    });

    router.post('/createAdminSemester', function(req, res) {
        var sem = new Semester();
        sem.title = req.body.semTitle;
        sem.startDate = req.body.startDate;
        sem.endDate = req.body.endDate;
        var directoryPath = path.join(__dirname + '/../uploads/' + sem.title);

        if (fs.existsSync(directoryPath)) {
            res.json({
                success: false,
                message: 'Semester Folder already exists'
            });
        } else {
            if (req.body.semTitle == null || req.body.semTitle == "" || req.body.startDate == null || req.body.startDate == "" || req.body.endDate == null || req.body.endDate == "") {
                res.json({
                    success: false,
                    message: 'Enter all required information'
                });
            } else {
                sem.save(function(err) {
                    if (err) {
                        if (err.errors != null) {
                            if (err.errors.semTitle) {
                                res.json({
                                    success: false,
                                    message: err.errors.semTitle.message
                                });
                            } else if (err.errors.startDate) {
                                res.json({
                                    success: false,
                                    message: err.errors.startDate.message
                                });
                            } else if (err.errors.endDate) {
                                res.json({
                                    success: false,
                                    message: err.errors.endDate.message
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        } else if (err) {
                            if (err.code == 11000) {
                                res.json({
                                    success: false,
                                    message: 'Semester is already there!'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        }
                    } else {
                        fs.mkdir(directoryPath, function(err) {
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

    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) throw err;

            if (user) {
                res.json({ success: false, message: 'That username is already taken' });
            } else {
                res.json({ success: false, message: 'Username is available' });
            }
        });
    });

    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) throw err;

            if (user) {
                res.json({ success: false, message: 'That e-mail is already taken' });
            } else {
                res.json({ success: false, message: 'e-mail is available' });
            }
        });
    });

    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password courses').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
            } else {
                if (req.body.password) {
                    //var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: 'No password provided' });
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

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");

        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({
                success: false,
                message: 'No token provided'
            });
        }
    });

    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });

    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select().exec(function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else {
                var newToken = jwt.sign({
                    user: user,
                    username: user.username,
                    email: user.email,
                    courses: user.courses
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

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user found' });
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    router.get('/management', function(req, res) {
        User.find({}, function(err, users) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'faculty') {
                        if (!users) {
                            res.json({ success: false, message: 'No users found' });
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission });
                        }
                    } else {
                        res.json({ success: false, message: 'Insufficient Permissions' });
                    }
                }
            });
        });
    });

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

    router.get('/getCourseFromId/:id', function(req, res) {
        console.log(req.params.id);

        Course.findOne({ _id: req.params.id }, function(err, course) {
            console.log(course);
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!course) {
                    res.json({ success: false, message: 'No course found' });
                } else {}
            }
        });
    });

    function formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1e3,
            d = b || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    router.post('/upload', upload.any(), function(req, res, next) {
        var submission = new Submission();
        var a = JSON.parse(req.body.assignment);
        if (req.files) {
            console.log(req.files);
            req.files.forEach(function(file) {
                var path = './app/uploads/' + a.semesterName + '/' + a.courseName + '/' + a.name + '/';
                var fileName = (new Date).valueOf() + '-' + file.originalname;
                fs.rename(file.path, path + fileName, function(err) {
                    if (err) throw err;
                    submission.student = req.decoded.username;
                    submission.assignment = a.name;
                    submission.dueDate = a.dueDate;
                    submission.submissionDate = Date.now();
                    submission.version = 1;
                    submission.path = path + fileName;
                    submission.course = a.course;
                    submission.courseName = a.courseName;
                    submission.semesterName = a.semesterName;
                    submission.size = formatBytes(file.size, 2);
                    if (submission.dueDate < submission.submissionDate) {
                        submission.status = 'Late';
                    } else {
                        submission.status = 'ontime';
                    }
                    submission.fileName = file.originalname;
                    Submission.findOne({ student: req.decoded.username, courseName: a.courseName, assignment: a.name, semesterName: a.semesterName }, function(err, sub) {
                        if (err) throw err;
                        if (!sub) {

                        } else {
                            var newPath = path + 'old/';
                            fs.rename(sub.path, newPath + sub.fileName, function(err) {
                                if (err) throw err;
                                sub.path = newPath + sub.fileName;
                                sub.save(function(err) {
                                    if (err) throw err;
                                });
                            });
                        }
                    });
                    submission.save(function(err, result) {
                        if (err) throw err;
                        if (!result) {
                            res.json({ success: false, message: 'Could not upload Assignment' });
                        } else {
                            Assignment.findOne({ _id: a._id }, function(err, assignment) {
                                if (err) throw err;
                                if (!assignment) {
                                    res.json({ success: false, message: 'No assignment found' });
                                } else {
                                    assignment.submissions.push(submission);
                                    assignment.save(function(err) {
                                        if (err) throw err;
                                    });
                                }
                            });
                        }
                    });
                });
            });
            res.json({ success: true, message: 'File uploaded successfully' });
        }
    });

    //Admin API
    router.post('/createAdminSemester', function(req, res) {
        var sem = new Semester();
        sem.title = req.body.semTitle;
        sem.startDate = req.body.startDate;
        sem.endDate = req.body.endDate;
        var directoryPath = path.join(__dirname + '/../uploads/' + sem.title);

        if (fs.existsSync(directoryPath)) {
            res.json({
                success: false,
                message: 'Semester Folder already exists'
            });
        } else {
            if (req.body.semTitle == null || req.body.semTitle == "" || req.body.startDate == null || req.body.startDate == "" || req.body.endDate == null || req.body.endDate == "") {
                res.json({
                    success: false,
                    message: 'Enter all required information'
                });
            } else {
                sem.save(function(err) {
                    if (err) {
                        if (err.errors != null) {
                            if (err.errors.semTitle) {
                                res.json({
                                    success: false,
                                    message: err.errors.semTitle.message
                                });
                            } else if (err.errors.startDate) {
                                res.json({
                                    success: false,
                                    message: err.errors.startDate.message
                                });
                            } else if (err.errors.endDate) {
                                res.json({
                                    success: false,
                                    message: err.errors.endDate.message
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        } else if (err) {
                            if (err.code == 11000) {
                                res.json({
                                    success: false,
                                    message: 'Semester is already there!'
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            }
                        }
                    } else {
                        fs.mkdir(directoryPath, function(err) {
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

    router.get('/getAdminSemesters/', function(req, res) {
        console.log('came here');
        Semester.find({}, function(err, sems) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, sems: sems });
            }
        });
    });

    router.post('/course', function(req, res) {
        var course = new Course();
        course.title = req.body.title;
        course.name = req.body.name;
        course.semester = req.body.semester._id;
        course.available = false;
        course.assignments = new Array();
        course.students = new Array();
        course.faculty = '';
        course.semesterName = req.body.semester.title;

        Semester.findOne({ _id: req.body.semester._id }).select('title').exec(function(err, semester) {
            var directoryPath = path.join(__dirname + '/../uploads/' + semester.title + '/' + course.title);
            if (fs.existsSync(directoryPath)) {
                res.json({
                    success: false,
                    message: 'Course Folder already exists'
                });
            } else {
                if (req.body.title == null || req.body.title == "" || req.body.name == null || req.body.name == "" || req.body.semester == null || req.body.semester == "") {
                    res.json({
                        success: false,
                        message: 'Enter all required information'
                    });
                } else {
                    course.save(function(err) {
                        if (err) {
                            res.json({
                                success: false,
                                message: err
                            });
                        } else {
                            fs.mkdir(directoryPath, function(err) {
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

    router.post('/getAllCourses', function(req, res) {
        Course.find({ semester: req.body.semester._id }, function(err, courses) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, courses: courses, semester: req.body.semester });
            }
        });
    });

    router.post('/getAllCoursesForSem', function(req, res) {
        Course.find({ semester: req.body._id }, function(err, courses) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, courses: courses, semester: req.body.semester });
            }
        });
    });

    router.post('/getStudentsSubmissionsForCourse', function(req, res) {
        Submission.find({ course: req.body._id }).exec(function(err, submissions) {
            if (err) throw err;
            if (!submissions) {
                res.json({ success: false, message: 'No assignments to display' });
            } else {
                res.json({ success: true, submissions: submissions });
            }
        });
    });

    router.post('/getStudentsSubmissionsForAssignment', function(req, res) {
        Submission.find({ assignment: req.body.name, courseName: req.body.courseName }).exec(function(err, submissions) {
            if (err) throw err;
            if (!submissions) {
                res.json({ success: false, message: 'No assignments to display' });
            } else {
                res.json({ success: true, submissions: submissions });
            }
        });
    });

    //Faculty API
    router.get('/getFacultySemesters', function(req, res) {
        Semester.find({}, function(err, sems) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, sems: sems });
            }
        });
    });

    router.post('/takeFacultyCourse', function(req, res) {

        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (!mainUser) {
                    res.json({ success: false, message: "no user found" });
                } else {
                    if (mainUser.permission === 'faculty') {
                        Course.findOne({ _id: req.body.course._id }, function(err, course) {
                            console.log(course);
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                            } else {
                                if (!course) {
                                    res.json({ success: false, message: 'Course not found' });
                                } else {
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
                                    } else {
                                        res.json({ success: false, message: 'Course is already taken' });
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
    });

    router.get('/getFacultyCourses', function(req, res) {
        Course.find({ faculty: req.decoded.user._id }).exec(function(err, courses) {
            if (err) throw err;
            if (!courses) {
                res.json({ success: false, message: 'No courses to display' });
            } else {
                res.json({ success: true, courses: courses });
            }
        });
    });

    router.post('/getFacultyCoursesForSem', function(req, res) {
        Course.find({ faculty: req.decoded.user._id, semester: req.body._id }).exec(function(err, courses) {
            if (err) throw err;
            if (!courses) {
                res.json({ success: false, message: 'No courses to display' });
            } else {
                res.json({ success: true, courses: courses });
            }
        });
    });

    router.post('/createAssignment', function(req, res) {
        var assignment = new Assignment();
        if (req.body.course == null || req.body.course == "" || req.body.name == null || req.body.name == "" || req.body.startDate == null || req.body.startDate == "" || req.body.dueDate == null || req.body.dueDate == "") {
            res.json({
                success: false,
                message: 'Enter all required information'
            });
        } else {

            Course.findOne({ _id: req.body.course._id }, function(err, course) {
                if (err) throw err;
                if (!course) {
                    res.json({
                        success: false,
                        message: "No course found!"
                    });
                } else {
                    Semester.findOne({ _id: course.semester }, function(err, semester) {
                        if (err) throw err;
                        if (!semester) {
                            res.json({
                                success: false,
                                message: "No Semester found!"
                            });
                        } else {
                            var path = './app/uploads/' + semester.title + '/' + course.title + '/' + req.body.name + '/';
                            if (fs.existsSync(path)) {
                                res.json({
                                    success: false,
                                    message: 'Assignment Folder already exists'
                                });
                            } else {
                                fs.mkdir(path, function(err) {
                                    if (err) throw err;
                                    fs.mkdir(path + 'old/', function(err) {
                                        if (err) throw err;
                                    });
                                });
                                assignment.name = req.body.name;
                                assignment.course = req.body.course._id;
                                assignment.faculty = req.body.course.faculty;
                                assignment.startDate = req.body.startDate;
                                assignment.dueDate = req.body.dueDate;
                                assignment.submissions = new Array();
                                assignment.semesterName = semester.title;
                                assignment.courseName = course.title;

                                assignment.save(function(err) {
                                    if (err) {
                                        res.json({
                                            success: false,
                                            message: err
                                        });
                                    } else {
                                        Course.findOne({ _id: assignment.course }, function(err, c) {
                                            if (err) throw err;
                                            if (!c) {
                                                res.json({
                                                    success: false,
                                                    message: "No course found!"
                                                });
                                            } else {
                                                c.assignments.push(assignment);
                                                c.save(function(err) {
                                                    res.json({
                                                        success: true,
                                                        message: 'Assignment Created!',
                                                        assignment: assignment
                                                    });
                                                });
                                            }
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

    router.post('/getAssignmentsForCourse', function(req, res) {
        Assignment.find({ course: req.body.course._id }).exec(function(err, assignments) {
            if (err) throw err;
            if (!assignments) {
                res.json({ success: false, message: 'No assignments to display' });
            } else {
                res.json({ success: true, assignments: assignments });
            }
        });
    });

    router.post('/getAFC', function(req, res) {
        Assignment.find({ course: req.body._id }).exec(function(err, assignments) {
            if (err) throw err;
            if (!assignments) {
                res.json({ success: false, message: 'No assignments to display' });
            } else {
                res.json({ success: true, assignments: assignments });
            }
        });
    });



    //Student API

    router.get('/getStudentSemesters', function(req, res) {
        Semester.find({}, function(err, sems) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, sems: sems });
            }
        });
    });

    router.post('/takeStudentCourse', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: "no user found" });
            } else {
                if (mainUser.permission === 'student') {
                    Course.findOne({ _id: req.body.course._id }, function(err, c) {
                        if (err) throw err;
                        if (!c) {
                            res.json({ success: false, message: "no course found" });
                        } else {
                            if (c.available === false) {
                                res.json({ success: false, message: 'Course is not available' });
                            } else {
                                mainUser.courses.push(c._id);
                                mainUser.save(function(err) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        c.students.push(mainUser);
                                        c.save(function(err) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                res.json({ success: true, message: 'Course has been updated!' });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    router.get('/getStudentCourses', function(req, res) {
        User.findOne({ _id: req.decoded.user._id }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                Course.find({ '_id': { '$in': user.courses } }, function(err, courses) {
                    if (err) throw err;
                    if (!courses) {
                        res.json({ success: false, message: 'course not found' });
                    } else {
                        res.json({ success: true, courses: courses });
                    }
                });
            }
        });
    });

    router.get('/getStudentAssignments', function(req, res) {
        User.findOne({ _id: req.decoded.user._id }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                Assignment.find({ 'course': { '$in': user.courses } }, function(err, assignments) {
                    if (err) throw err;
                    if (!assignments) {
                        res.json({ success: false, message: 'course not found' });
                    } else {
                        res.json({ success: true, assignments: assignments });
                    }
                });
            }
        });
    });

    router.post('/getSubmissionsForCourse', function(req, res) {
        Submission.find({ course: req.body._id, student: req.decoded.username }).exec(function(err, submissions) {
            if (err) throw err;
            if (!submissions) {
                res.json({ success: false, message: 'No assignments to display' });
            } else {
                res.json({ success: true, submissions: submissions });
            }
        });
    });

    router.post('/downloadAssignment', function(req, res) {
        var submission = req.body.path;
        res.download(submission);
    });

    router.post('/downloadOneAssignment', function(req, res) {
        var submission = req.body.path;
        res.download(submission);
    });

    router.post('/downloadCourseAssignments', function(req, res) {
        var course = req.body;
        console.log(req.body);
        var archive = archiver('zip');
        archive.on('error', function(err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        });

        archive.on('finish', function(err) {
            return res.end();
        });
        //on stream closed we can end the request
        archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
        });
        var header = {
            "Content-Type": "application/zip",
            'Content-disposition': 'attachment; filename=download.zip',
        };

        res.writeHead(200, header);

        archive.store = true; // don't compress the archive
        archive.pipe(res);

        var path = './app/uploads/' + course.semesterName + '/' + course.title + '/';
        archive.directory(path, false);

        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['**/*']
        }]).finalize();
    });

    router.post('/downloadIndividualAssignments', function(req, res) {
        var assignment = req.body;
        console.log(req.body);
        var archive = archiver('zip');
        archive.on('error', function(err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        });

        archive.on('finish', function(err) {
            return res.end();
        });
        //on stream closed we can end the request
        archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
        });
        var header = {
            "Content-Type": "application/zip",
            'Content-disposition': 'attachment; filename=download.zip',
        };

        res.writeHead(200, header);

        archive.store = true; // don't compress the archive
        archive.pipe(res);

        var path = './app/uploads/' + assignment.semesterName + '/' + assignment.courseName + '/' + assignment.name + '/';
        archive.directory(path, false);

        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['**/*']
        }]).finalize();
    });

    router.post('/downloadLatestAssignments', function(req, res) {
        var assignment = req.body;
        var archive = archiver('zip');
        archive.on('error', function(err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        });

        archive.on('finish', function(err) {
            return res.end();
        });
        //on stream closed we can end the request
        archive.on('end', function() {
            console.log('Archive wrote %d bytes', archive.pointer());
        });
        var header = {
            "Content-Type": "application/zip",
            'Content-disposition': 'attachment; filename=download.zip',
        };

        res.writeHead(200, header);

        archive.store = true; // don't compress the archive
        archive.pipe(res);

        var path = './app/uploads/' + assignment.semesterName + '/' + assignment.courseName + '/' + assignment.name + '/';
        archive.directory(path, false);

        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['.']
        }]).finalize();
    });

    return router;
}