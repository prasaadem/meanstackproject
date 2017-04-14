angular.module('semesterController', ['semServices','userServices','fileModelDirective','uploadFileService'])

// Controller: User to control the management page and managing of user accounts
.controller('semesterCtrl', function($http,$location,$timeout,Semester,Course,User,$scope, $routeParams,Assignment,uploadFile) {

    $scope.file = {};
    $scope.Submit = function(){
        $scope.uploading = true;
        uploadFile.upload($scope.file).then(function(data){
            if (data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {};
            }else{
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
            console.log(data.data.message);
        });
    };

    this.newAssignment = function(data){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
            Assignment.createAssignment(app.data).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
            });
    };

    this.addSemester = function(semData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;

            Semester.createSem(app.semData).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
            });
    };

    this.addCourse = function(courseData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;

            Course.createCourse(app.courseData).then(function(data){
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
            });
    };

    this.takeCourse = function(data){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        console.log(data);
            Course.takeCourse(app.data).then(function(data){
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
            });
    };

    var app = this;

    app.loading = true; // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load
    app.limit = 5; // Set a default limit to ng-repeat
    app.searchLimit = 0; // Set the default search page results limit to zero

    app.sems = [];
    app.courses = [];
    app.assignments = [];
    app.courseAssignments = [];
    
    // Function: get all the users from database
    function getSemesters() {
        // Runs function to get all the users from database
        Semester.getSemesters().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                app.sems = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getCourses() {
        // Runs function to get all the users from database
        Semester.getCourses().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                app.courses = data.data.courses;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getmyCourses() {
        // Runs function to get all the users from database
        User.getmyCourses().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                app.user = data.data.user;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getCourseFromId() {
        // Runs function to get all the users from database
        User.getmyCourses().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                app.user = data.data.user;
                app.user.courses.forEach(function(entry) {
                    if (entry._id === $routeParams.id) {
                        app.currentCourse = entry;
                    }
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getAssignments() {
        // Runs function to get all the users from database
        Assignment.getAssignments().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                
                data.data.assignments.forEach(function(entry) {
                    if (entry.user._id === app.user._id) {
                        app.assignments.push(entry);
                    }
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getAssignmentFromId() {
        app.a = [];
        Assignment.getAssignments().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                
                data.data.assignments.forEach(function(entry) {
                    if (entry.user._id === app.user._id) {
                        app.a.push(entry);
                    }
                });
                app.a.forEach(function(entry) {
                    if (entry.course._id === $routeParams.id) {
                        app.courseAssignments.push(entry);
                    }
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getStudentAssignments() {
        // Runs function to get all the users from database
        Assignment.getAssignments().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                
                data.data.assignments.forEach(function(entry) {
                    app.user.courses.forEach(function(course) {
                        if (entry.course._id === course._id) {
                            app.assignments.push(entry);
                        }
                    });
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getStudentAssignmentsById() {
        // Runs function to get all the users from database
        Assignment.getAssignments().then(function(data) {
            if (data.data.success) {
                // Check which permissions the logged in user has
                
                data.data.assignments.forEach(function(entry) {
                        if (entry.course._id === $routeParams.id) {
                            app.courseAssignments.push(entry);
                        }
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    User.getmyCourses().then(function(data) {
        if (data.data.success) {
                // Check which permissions the logged in user has
            app.user = data.data.user;
        } else {
            app.errorMsg = data.data.message; // Set error message
            app.loading = false; // Stop loading icon
        }
    });

    getCourseFromId();
    getSemesters();
    getCourses();
    getmyCourses();
    getAssignments();
    getAssignmentFromId();
    getStudentAssignments();
    getStudentAssignmentsById();
});