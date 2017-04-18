angular.module('adminController', ['adminServices'])

.controller('adminCtrl', function($http,$location,$timeout,Semester,Course,User,$scope, $routeParams) {

    var app = this;
    app.semesters = [];
    app.courses = {};
    app.semesterHeading = [];

    this.addSemester = function(semData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        app.sems = [];

        Semester.createSemester(app.semData).then(function(data){
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

    //Courses
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
                                    app.courses[semester.title].push(course);
                                }
                            });
                        });
                    } else {
                        app.errorMsg = data.data.message; // Set error message
                        app.loading = false; // Stop loading icon
                    }
                });
                // console.log(app.semesterHeading);
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
                console.log(app.semesters);
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getSemesters();

});