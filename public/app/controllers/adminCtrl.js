var sems = [];
angular.module('adminController', ['adminServices'])

.controller('adminCtrl', function($http, $location, $timeout, Semester, Course, User, $scope, $routeParams) {
    var app = this;

    app.loading = true;
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load

    app.userData = {};
    app.semData = {};
    app.courseData = {};
    app.sems = [];
    app.courses = [];


    $scope.dayDataCollapse = [false, false, false, false, false, false];
    $scope.previousIndex = 0;

    //Semester
    this.addSemester = function(semData) {
        var app = this;

        Semester.createSemester(app.semData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/showSemester');
                }, 1000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    function getSemesters() {
        Semester.getSemesters().then(function(data) {
            if (data.data.success) {
                app.sems = data.data.sems;
                sems = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getSemesters();

    function editSemester() {
        sems.forEach(function(sem) {
            if (sem._id === $routeParams.id) {
                app.semData.title = sem.title; // Display user's name in scope
                var d = new Date(sem.startDate);
                app.semData.startDate = d;
                var d = new Date(sem.endDate);
                app.semData.endDate = d;
                app.semData.id = sem._id;
            }
        });
    }
    editSemester();

    app.updateSemester = function(semData) {
        var app = this;
        Semester.updateSemester(app.semData).then(function(data) {
            if (data.data.success) {
                getSemesters();
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/showSemester');
                }, 1000);
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
    };

    app.deleteSemester = function(id) {
        Semester.deleteSemester(id).then(function(data) {
            if (data.data.success) {
                getSemesters();
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    //Course
    this.addCourse = function(courseData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;

        Course.createCourse(app.courseData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/showCourse');
                }, 2000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    $scope.dayDataCollapseFn = function(index, sem) {
        for (var i = 0; storeDataModel.storedata.length - 1; i += 1) {
            $scope.dayDataCollapse.append('false');
        }
    };

    $scope.selectTableRow = function(index, sem) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            app.courses = sem.courses;
        }
    };

    app.updateCourse = function(courseData) {
        var app = this;
        Course.updateCourse(app.courseData).then(function(data) {
            if (data.data.success) {
                getSemesters();
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/');
                }, 1000);
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    app.deleteCourse = function(id) {
        Course.deleteCourse(id).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getSemesters(); // Reset users on page
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/showCourse');
                }, 1000);
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    //Student

    // Function: get all the users from database
    function getUsers() {
        // Runs function to get all the users from database
        $scope.students = [];
        $scope.faculties = [];

        User.getUsers().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                if (data.data.permission === 'admin') {
                    data.data.users.forEach(function(user) {
                        if (user.permission === "student") {
                            $scope.students.push(user);
                        } else if (user.permission === "faculty") {
                            $scope.faculties.push(user);
                        }
                    });
                    // app.users = data.data.users; // Assign users from database to variable
                    app.loading = false; // Stop loading icon
                    app.accessDenied = false; // Show table
                    // Check if logged in user is an admin or faculty
                    if (data.data.permission === 'admin') {
                        app.editAccess = true; // Show edit button
                        app.deleteAccess = true; // Show delete button
                    } else if (data.data.permission === 'faculty') {
                        app.editAccess = false; // Show edit button
                    } else if (data.data.permission === 'student') {
                        app.editAccess = false; // Show edit button
                    }
                } else {
                    app.errorMsg = 'Insufficient Permissions'; // Reject edit and delete options
                    app.loading = false; // Stop loading icon
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getUsers(); // Invoke function to get users from databases

    User.getUser($routeParams.id).then(function(data) {
        if (data.data.success) {
            app.userData.netId = data.data.user.username; // Display user's name in scope
            app.userData.username = data.data.user.username;
            app.userData.email = data.data.user.email;
            app.userData.uin = data.data.user.uin;
            app.userData.permission = data.data.user.permission;
            app.userData.name = data.data.user.name;
            app.userData.major = data.data.user.major;
            app.userData.classification = data.data.user.classification;
            app.userData.id = data.data.user._id;
        } else {
            // app.errorMsg = data.data.message; // Set error message
            $scope.alert = 'alert alert-danger'; // Set class for message
        }
    });

    app.updateUser = function(userData) {
        var app = this;
        console.log(userData);
        User.updateUser(userData).then(function(data) {
            if (data.data.success) {
                getUsers(); // Reset users on page
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/');
                }, 1000);
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    // Function: Delete a user
    app.deleteUser = function(username) {
        // Run function to delete a user
        User.deleteUser(username).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getUsers(); // Reset users on page
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

})