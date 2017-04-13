angular.module('semesterController', ['semServices'])

// Controller: User to control the management page and managing of user accounts
.controller('semesterCtrl', function($http,$location,$timeout,Semester,Course) {

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
        console.log(courseData);

            Course.createCourse(app.courseData).then(function(data){
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

    getSemesters();

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

    getCourses();

});