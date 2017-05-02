var express = require('express');

var User = require('../models/user'); //User Model
var Course = require('../models/course'); //Course Model
var Assignment = require('../models/assignment'); //Course Model
var Semester = require('../models/semester'); //Semester Model
var Submission = require('../models/submission');

var jwt = require('jsonwebtoken');
var secret = 'pld';

var path = require('path'); //used for file path
var fs = require('fs');

var archiver = require('archiver');
var async = require('async');

var multer = require('multer');


var upload = multer({ dest: './app/uploads/' });

module.exports = function(router) {

    // User

    //http://localhost:PORT/api/addAdmin
    //Admin Registration Route
    router.post('/addAdmin', function(req, res) {
        var admin = new User();
        admin.username = req.body.username;
        admin.email = req.body.email;
        admin.uin = req.body.uin;
        admin.permission = req.body.permission;
        admin.accountExpires = req.body.accountExpires;
        admin.name = req.body.name;
        admin.directoryName = req.body.directoryName;
        admin.major = req.body.major;
        admin.classification = req.body.classification;
        admin.password = req.body.password;
        admin.courses = [];

        admin.save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            } else {
                res.json({
                    success: true,
                    message: 'Admin Created in the database successfully!',
                    admin: admin
                });
            }
        });
    });

    //http://localhost:PORT/api/addUser
    //User Registration Route
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        user.courses = req.body.courses;
        user.uin = Math.floor((Math.random() * 100000000) + 1);
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
        User.findOne({ username: req.body.username }).exec(function(err, user) {
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

    //Admin API

    router.post('/createSemester', function(req, res) {
        var sem = new Semester();
        sem.title = req.body.semTitle;
        sem.startDate = req.body.startDate;
        sem.endDate = req.body.endDate;
        sem.courses = [];
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

    router.get('/getSemesters/', function(req, res) {
        Semester
            .find()
            .populate('courses')
            .exec(function(err, sems) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, sems: sems });
                }
            });
    });

    router.put('/updateSemester', function(req, res) {
        var sem = req.body;
        Semester.findOne({ _id: sem.id }, function(err, u) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!u) {
                    res.json({ success: false, message: 'No semester found' });
                } else {
                    u.title = sem.title;
                    u.startDate = sem.startDate;
                    u.endDate = sem.endDate;
                    u.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            res.json({ success: true, message: 'Updated semester' });
                        }
                    });
                }
            }
        });
    });

    router.delete('/deleteSemester/:id', function(req, res) {
        var deletedSemester = req.params.id;
        Semester.findOneAndRemove({ _id: deletedSemester }, function(err, sem) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                res.json({ success: true });
            }
        });
    });

    router.post('/createCourse', function(req, res) {
        var course = new Course();
        course.title = req.body.title;
        course.name = req.body.name;
        course.semester = req.body.semester._id;
        course.available = false;
        course.assignments = new Array();
        course.students = new Array();

        // course.faculty = new User();

        Semester.findOne({ _id: req.body.semester._id }).exec(function(err, semester) {
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
                            semester.courses.push(course._id);
                            semester.save(function(err) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        message: 'Course Created!'
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    router.put('/updateCourse', function(req, res) {
        var course = req.body;
        Course.findOne({ _id: course.id }, function(err, u) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!u) {
                    res.json({ success: false, message: 'No course found' });
                } else {
                    u.title = course.title;
                    u.name = course.name;
                    u.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log(u);
                            res.json({ success: true, message: 'Updated Course' });
                        }
                    });
                }
            }
        });
    });

    router.delete('/deleteCourse/:id', function(req, res) {
        var deleteCourse = req.params.id;
        Course.findOneAndRemove({ _id: deleteCourse }, function(err, course) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                res.json({ success: true, message: 'Course Deleted successfully' });
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
                    if (mainUser.permission === 'admin') {
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

    router.put('/updateUser', function(req, res) {
        var user = req.body;
        console.log(user);
        User.findOne({ _id: user.id }, function(err, u) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!u) {
                    res.json({ success: false, message: 'No user found' });
                } else {
                    u.username = user.username;
                    u.email = user.email;
                    u.uin = user.uin;
                    u.permission = user.permission;
                    u.name = user.name;
                    u.major = user.major;
                    u.classification = user.classification;
                    u.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            res.json({ success: true, message: 'Updated user' });
                        }
                    });
                }
            }
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


    //Faculty API
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
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
                            } else {
                                if (!course) {
                                    res.json({ success: false, message: 'Course not found' });
                                } else {
                                    if (course.available === false) {
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
        Course
            .find({ faculty: req.decoded.user._id })
            .populate('students')
            .populate('assignments')
            .populate('semester')
            .populate('grader')
            .exec(function(err, courses) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!courses) {
                        res.json({ success: false, message: 'No courses to display' });
                    } else {
                        res.json({ success: true, courses: courses });
                    }
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
            Course
                .findOne({ _id: req.body.course._id })
                .populate('semester')
                .exec(function(err, course) {
                    if (err) throw err;
                    if (!course) {
                        res.json({
                            success: false,
                            message: "No course found!"
                        });
                    } else {
                        var path = './app/uploads/' + course.semester.title + '/' + course.title + '/' + req.body.name + '/';
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
                            assignment.path = path;
                            assignment.marks = req.body.marks;
                            assignment.comments = req.body.comments;

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

    router.get('/getAssignments/', function(req, res) {
        Assignment
            .find({ faculty: req.decoded.user._id })
            .populate('course')
            .exec(function(err, assignments) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, assignments: assignments });
                }
            });
    });

    router.put('/updateAssignment', function(req, res) {
        Assignment.findOne({ _id: req.body.id }, function(err, u) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!u) {
                    res.json({ success: false, message: 'No semester found' });
                } else {
                    u.comments = req.body.comments;
                    u.marks = req.body.marks;
                    u.startDate = req.body.startDate;
                    u.dueDate = req.body.dueDate;
                    u.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            res.json({ success: true, message: 'Updated Assignment' });
                        }
                    });
                }
            }
        });
    });

    router.post('/getStudentsSubmissionsForAssignment', function(req, res) {
        Submission
            .find({ assignment: req.body._id, course: req.body.course })
            .populate('student')
            .populate('assignment')
            .exec(function(err, submissions) {
                if (err) throw err;
                if (!submissions) {
                    res.json({ success: false, message: 'No assignments to display' });
                } else {
                    res.json({ success: true, submissions: submissions });
                }
            });
    });

    router.post('/downloadCourseAssignments', function(req, res) {
        var course = req.body;
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

        var path = './app/uploads/' + course.semester.title + '/' + course.title + '/';
        archive.directory(path, false);

        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['**/*']
        }]).finalize();
    });

    router.post('/downloadIndividualAssignments', function(req, res) {
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

        var path = req.body.path;
        archive.directory(path, false);

        archive.bulk([{
            expand: true,
            cwd: path,
            src: ['**/*']
        }]).finalize();
    });

    router.post('/postGradeAndComment', function(req, res) {
        console.log(req.body.submission);
        Submission.findOne({ _id: req.body.submission._id }).exec(function(err, s) {
            if (err) throw err;
            if (!s) {
                res.json({ success: false, message: 'No submissions to display' });
            } else {
                s.marksSecured = req.body.marks;
                s.comments = req.body.comments;
                s.graded = true;
                s.save(function(err) {
                    if (err) throw err;
                    Submission.find({ assignment: s.assignment._id, graded: false, statusString: 'Most Recent' }, function(err, submissions) {
                        if (err) throw err;
                        if (!submissions) {
                            Assignment.findOne({ _id: s.assignment._id }, function(err, a) {
                                if (err) {
                                    throw err;
                                }
                                if (!a) {

                                } else {
                                    a.evaluation = "Completed";
                                    a.save(function(err) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }
                            });
                        } else {
                            res.json({ success: true, message: 'Graded successfully', submissions: submissions });
                        }
                    });
                });
            }
        });
    });

    router.post('/assignGrader', function(req, res) {
        User.findOne({ _id: req.body.grader }, function(err, grader) {
            if (err) throw err;
            if (!grader) {
                res.json({ success: false, message: 'No grader found' });
            } else {
                if (grader.grader === true) {
                    res.json({ success: false, message: 'Is already grading another course' });
                } else {
                    grader.gradingCourse = req.body.course._id;
                    grader.grader = true;
                    grader.save(function(err) {
                        if (err) throw err;
                        Course.findOne({ _id: req.body.course._id }, function(err, course) {
                            if (err) throw err;
                            if (!course) {
                                res.json({ success: false, message: 'No course found' });
                            } else {
                                if (course.haveGrader) {
                                    User.findOne({ _id: course.grader }, function(err, grader) {
                                        if (err) throw err;
                                        if (!grader) {
                                            res.json({ success: false, message: 'No grader found' });
                                        } else {
                                            grader.grader = false;
                                            // grader.gradingCourse = course._id;
                                            grader.save(function(err) {
                                                if (err) throw err;
                                            });
                                        }
                                    });
                                }
                                course.grader = req.body.grader;
                                course.haveGrader = true;
                                course.save(function(err) {
                                    if (err) throw err;
                                    res.json({ success: true, message: 'Grader updated' });
                                });
                            }
                        });
                    });
                }
            }
        });
    });


    //Student API

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
                Course
                    .find({ '_id': { '$in': user.courses } })
                    .populate('assignments')
                    .populate('semester')
                    .populate('faculty')
                    .exec(function(err, courses) {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!courses) {
                                res.json({ success: false, message: 'No courses to display' });
                            } else {
                                res.json({ success: true, courses: courses });
                            }
                        }
                    });
            }
        });
    });

    router.get('/getGraderCourse', function(req, res) {
        User.findOne({ _id: req.decoded.user._id }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                Course
                    .findOne({ _id: user.gradingCourse })
                    .populate('assignments')
                    .populate('semester')
                    .populate('faculty')
                    .exec(function(err, course) {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!course) {
                                res.json({ success: false, message: 'No courses to display' });
                            } else {
                                res.json({ success: true, course: course });
                            }
                        }
                    });
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
        console.log(a);
        if (req.files) {
            console.log(req.files);
            req.files.forEach(function(file) {
                var size = formatBytes(file.size, 2);
                var path = a.path;
                var fileName = req.decoded.user.uin + '-' + file.originalname;
                fs.rename(file.path, path + fileName, function(err) {
                    if (err) throw err;
                    submission.student = req.decoded.user._id;
                    submission.assignment = a._id;
                    submission.dueDate = a.dueDate;
                    submission.submissionDate = Date.now();
                    submission.version = 1;
                    submission.path = path + fileName;
                    submission.course = a.course;
                    submission.size = formatBytes(file.size, 2);
                    if (submission.dueDate < submission.submissionDate) {
                        submission.status = 'Late';
                    } else {
                        submission.status = 'ontime';
                    }
                    submission.fileName = file.originalname;
                    Submission.findOne({ student: req.decoded.user._id, courseName: a.courseName, assignment: a._id, semesterName: a.semesterName, statusString: 'Most Recent' }, function(err, sub) {
                        if (err) throw err;
                        if (!sub) {

                        } else {
                            var newPath = path + 'old/';
                            fs.rename(sub.path, newPath + sub.fileName, function(err) {
                                if (err) throw err;
                                sub.path = newPath + sub.fileName;
                                sub.statusString = "Old Submission";
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

    router.post('/getSubmissionsForCourse', function(req, res) {
        Submission
            .find({ course: req.body._id, student: req.decoded.user._id })
            .populate('assignment')
            .exec(function(err, submissions) {
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
    return router;
}