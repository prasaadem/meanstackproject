angular.module('adminController', ['adminServices'])

.controller('adminCtrl', function($http, $location, $timeout, Semester, Course, User, $scope, $routeParams) {
    var app = this;

    app.loading = true;
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load
    app.searchLimit = 0; // Set the default search page results limit to zero

    app.sems = [];
    app.courses = [];


    $scope.dayDataCollapse = [false, false, false, false, false, false];
    $scope.previousIndex = 0;

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
            Course.getAllCoursesForSem(sem).then(function(data) {
                if (data.data.success) {
                    app.loading = false;
                    app.succMsg = data.data.message;
                    $scope.courses = data.data.courses;
                    app.semester = data.data.semester;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        }
    };

    //Semester
    this.addSemester = function(semData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;

        Semester.createAdminSemester(app.semData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                // $timeout(function(){
                //     $location.path('/');
                // },2000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    //Courses
    this.addCourse = function(courseData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;

        Course.createAdminCourse(app.courseData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/');
                }, 2000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    this.getCoursesForSem = function(data) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Course.getAdminCoursesForSem(app.data).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                app.courses = data.data.courses;
                app.semester = data.data.semester;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    function getSemesters() {
        Semester.getAdminSemesters().then(function(data) {
            if (data.data.success) {
                app.sems = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getSemesters();

})