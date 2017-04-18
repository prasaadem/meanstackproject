angular.module('facultyController', ['facultyServices'])

.controller('facultyCtrl', function($http,$location,$timeout,Semester,Course,User,$scope, $routeParams) {

    var app = this;
    app.semesters = [];
    app.courses = {};
    app.semesterHeading = [];
    app.courseStatus = {};


    //Faculty taking a course
    this.takeCourse = function(courseData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        console.log(app.courseData);
        Course.takeCourse(app.courseData).then(function(data){
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

    function getAdminCourses(){
        Course.getAdminCourses().then(function(data){
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                app.tempCourses = data.data.courses;
                Semester.getSemesters().then(function(data) {
                    if (data.data.success) {
                        app.semesters = data.data.sems;
                        app.tempCourses.forEach(function(course){
                           // console.log(course);
                            app.semesters.forEach(function(semester){
                                //console.log(semester);
                                if (semester._id === course.semester) {
                                    if (!app.courses[semester.title]) {
                                        app.courses[semester.title] = [];
                                        app.semesterHeading.push(semester.title);
                                    }
                                    if (course.available) {
                                        app.courseStatus[course.name] = "Registered";
                                    }else{
                                        app.courseStatus[course.name] = "Register";
                                    }
                                    app.courses[semester.title].push(course);
                                }
                            });
                        });
                    } else {
                        app.errorMsg = data.data.message; // Set error message
                        app.loading = false; // Stop loading icon
                    }
                });
                console.log(app.courseStatus);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
    getAdminCourses();

    function getSemesters() {
        Semester.getSemesters().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                app.semesters = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getSemesters();

});
