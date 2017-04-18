angular.module('semesterController', ['semServices','userServices','fileModelDirective','uploadFileService'])

// Controller: User to control the management page and managing of user accounts
.controller('semesterCtrl', function($http,$location,$timeout,Semester,Course,User,$scope, $routeParams,Assignment,uploadFile) {

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
    app.facultyAssignmentsForCourseId = [];



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

    //Create new Assignment
    this.createAssignment = function(assignmentData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Assignment.createAssignment(app.assignmentData).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    this.getCoursesForSem = function(data){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Course.getCoursesForSem(app.data).then(function(data){
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                app.courses = data.data.courses;
                app.semester = data.data.semester;
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    this.getAssignmentsForCourse = function(assignmentData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Assignment.getAssignmentsForCourse(app.assignmentData).then(function(data) {
            if (data.data.success) {
                app.assignmentsForCourse = data.data.assignments;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    

    //getfaculty courses
    function getFacultyCourses(){
        Course.getFacultyCourses().then(function(data) {
            if (data.data.success) {
                app.facultyCourses = data.data.courses;
                app.facultySems = data.data.semesters;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getFacultyCourses();


     //get CourseFromId
     function getCourseFromId() {
        Course.getFacultyCourses().then(function(data) {
            if (data.data.success) {
                for (var i = data.data.courses.length - 1; i >= 0; i--) {
                    if (data.data.courses[i]._id === $routeParams.id) {
                        app.currentCourse = data.data.courses[i];
                        app.currentSemester = data.data.semesters[i];                     }                
                }
            }else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getCourseFromId();

    function getFacultyAssignmentsForCourseId() {
        Course.getFacultyAssignmentsForCourseId().then(function(data) {
            if (data.data.success) {
                for (var i = data.data.assignments.length - 1; i >= 0; i--) {
                    if (data.data.assignments[i].course === $routeParams.id) {
                        app.facultyAssignmentsForCourseId.push(data.data.assignments[i]);                    }                
                }
            }else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getFacultyAssignmentsForCourseId();

    function getStudentCourses(){
        Course.getStudentCourses().then(function(data) {
            if (data.data.success) {
                console.log(data.data);
                app.studentCourses = data.data.courses;
                //app.studentSems = data.data.semesters;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    getStudentCourses();

//     function getCourses() {
//         // Runs function to get all the users from database
//         Course.getCourses().then(function(data) {
//             // Check if able to get data from database
//             if (data.data.success) {
//                 // Check which permissions the logged in user has
//                 app.courses = data.data.courses;
//             } else {
//                 app.errorMsg = data.data.message; // Set error message
//                 app.loading = false; // Stop loading icon
//             }
//         });
//     }

//     // function getFacultyAssignmentFromId() {
//     //     User.getFacultyCourses().then(function(data) {
//     //         if (data.data.success) {
//     //             app.user = data.data.user;
//     //         } else {
//     //             app.errorMsg = data.data.message; // Set error message
//     //             app.loading = false; // Stop loading icon
//     //         }
//     //     });

// //     Course.getCourses().then(function(data) {
// //         if (data.data.success) {
// //             data.data.courses.forEach(function(course){
// //                 app.user.courses.forEach(function(c){
// //                     if (course._id === c._id) {
// //                         course.assignments.forEach(function(assignment){
// //                             if (course._id === $routeParams.id) {
// //                                 app.facultyCourseAssignments.push(assignment);
// //                             }
// //                         });
// //                     }   
// //                 });
// //             });
// //         }else {
// //             app.errorMsg = data.data.message; // Set error message
// //             app.loading = false; // Stop loading icon
// //         }
// //     });
// // }


//         Course.getCourse().then(function(data) {
//             if (data.data.success) {
//                             } else {
//                 app.errorMsg = data.data.message; // Set error message
//                 app.loading = false; // Stop loading icon
//             }
//         });
//     }

//     // function getStudentCourses() {
//     //     Course.getCourses().then(function(data) {
//     //         // Check if able to get data from database
//     //         if (data.data.success) {
//     //             data.data.courses.forEach(function(course){
//     //                 course.students.forEach(function(student){
//     //                     if (student.username === app.user.username) {
//     //                         app.studentCourses.push(course);
//     //                     }
//     //                 });
//     //             });

//     //         } else {
//     //             app.errorMsg = data.data.message; // Set error message
//     //             app.loading = false; // Stop loading icon
//     //         }
//     //     });
//     // }

//     // function getStudentAssignments() {
//     //     Course.getCourses().then(function(data) {
//     //         // Check if able to get data from database
//     //         if (data.data.success) {
//     //             data.data.courses.forEach(function(course){
//     //                 course.assignments.forEach(function(assignment){
//     //                         app.studentAssignments.push(assignment);
//     //                 });
//     //             });

//     //         } else {
//     //             app.errorMsg = data.data.message; // Set error message
//     //             app.loading = false; // Stop loading icon
//     //         }
//     //     });
//     // }

//     // function getStudentAssignmentsById() {
//     //     Course.getCourses().then(function(data) {
//     //         // Check if able to get data from database
//     //         if (data.data.success) {
//     //             data.data.courses.forEach(function(course){
//     //                 course.assignments.forEach(function(assignment){
//     //                     if (course._id === $routeParams.id) {
//     //                         app.studentCourseAssignments.push(assignment);
//     //                     }   
//     //                 });
//     //             });
//     //         } else {
//     //             app.errorMsg = data.data.message; // Set error message
//     //             app.loading = false; // Stop loading icon
//     //         }
//     //     });
//     // }



//     //getCourses();

//     // getAssignments();
//     // getFacultyAssignmentFromId();

//      getCourseFromId();

//     // getStudentCourses();
//     // getStudentAssignments();
//     // getStudentAssignmentsById();
});