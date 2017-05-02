var sems = [];
var courses = [];
var assignments = [];

angular.module('facultyController', ['adminServices', 'userServices'])

.controller('facultyCtrl', function($http, $location, $timeout, Semester, Course, Submission, User, $scope, $routeParams, Assignment) {

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
    app.submissionCount = [];
    app.studentSubmissionsForAssignment = [];

    app.grading = false;
    app.submission = false;

    $scope.dayDataCollapse = [false, false, false, false, false, false];
    $scope.previousIndex = 0;

    //Semester
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

    this.getCoursesForSem = function(data) {
        app.courses = data.semester.courses;
    };

    //Faculty taking a course
    this.takeFacultyCourse = function(courseData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        console.log(app.courseData);
        Course.takeFacultyCourse(app.courseData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
                // $timeout(function() {
                //     $location.path('/');
                // }, 2000);
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    Course.getFacultyCourses().then(function(data) {
        app.facultyCourses = data.data.courses;
        courses = data.data.courses;
    });

    $scope.dayDataCollapseFn = function(index, sem) {
        for (var i = 0; storeDataModel.storedata.length - 1; i += 1) {
            $scope.dayDataCollapse.append('false');
        }
    };

    $scope.selectTableRow = function(index, sem) {
        $scope.courses = [];
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            courses.forEach(function(course) {
                if (course.semester._id === sem._id) {
                    $scope.courses.push(course);
                }
            });
        }
    };

    //get CourseFromId
    function getCourseFromId() {
        courses.forEach(function(course) {
            if (course._id === $routeParams.id) {
                app.currentCourse = course;
            }
        });
    }
    getCourseFromId();

    //Assignment
    this.createAssignment = function(assignmentData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Assignment.createAssignment(app.assignmentData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    function getAssignments() {
        Assignment.getAssignments().then(function(data) {
            if (data.data.success) {
                app.assignments = data.data.assignments;
                assignments = data.data.assignments;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getAssignments();

    this.getAssignmentsForCourse = function(data) {
        app.courseAssignments = data.course.assignments;
    }

    this.getAssignmentDetails = function(data) {
        app.data.comments = data.assignment.comments;
        app.data.marks = data.assignment.marks;
        var d = new Date(data.assignment.startDate);
        app.data.startDate = d;
        var d = new Date(data.assignment.dueDate);
        app.data.dueDate = d;
        app.data.id = data.assignment._id;
    }

    app.updateAssignment = function(data) {
        var app = this;
        Assignment.updateAssignment(app.data).then(function(data) {
            if (data.data.success) {
                app.succMsg = data.data.message;
                $timeout(function() {
                    $location.path('/viewAssignments');
                }, 1000);
            } else {
                app.errorMsg = data.data.message; // Set error message
            }
        });
    };

    $scope.assignment = function(index, course) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            app.submissionCount = [];
            courses.forEach(function(c) {
                if (c._id === course._id) {
                    $scope.courseAssignments = c.assignments;
                    $scope.courseAssignments.forEach(function(assignment) {
                        if (assignment.submissions.length === 0) {
                            app.submissionCount.push(0);
                        } else {
                            app.submissionCount.push(assignment.submissions.length);
                        }
                    });
                }

            });
        }
    };

    $scope.showSubmissions = function(index, assignment) {
        app.tobeGraded = [];
        Submission.getStudentsSubmissionsForAssignment(assignment).then(function(data) {
            if (data.data.success) {
                app.studentSubmissionsForAssignment = data.data.submissions;
                if (app.studentSubmissionsForAssignment.length == 0) {
                    app.submission = false;
                } else {
                    app.submission = true;
                }
                app.studentSubmissionsForAssignment.forEach(function(submission) {
                    if (submission.statusString === 'Most Recent' && submission.graded === false) {
                        app.tobeGraded.push(submission);
                    }
                });
                if (app.tobeGraded.length == 0) {
                    app.grading = false;
                } else {
                    app.grading = true;
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    };

    //Download
    $scope.downloadCourseAssignments = function(index, course) {
        var app = this;
        app.name = course.semester.title + '-' + course.title;
        Submission.downloadCourseAssignments(app.course).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadIndividualAssignments = function(index, assignment) {
        var app = this;
        app.name = assignment.name;
        Submission.downloadIndividualAssignments(app.assignment).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadOneAssignment = function(index, submission) {
        var app = this;
        app.name = submission.fileName;
        Submission.downloadOneAssignment(app.submission).then(function(data) {
            var file = new Blob([(data.data)]);
            console.log(file.size);
            saveAs(file, app.name);
        });
    }

    //Grading
    this.grade = function(gradeData) {
        Submission.postGradeAndComment(gradeData).then(function(data) {
            if (data.data.success) {
                app.studentSubmissionsForAssignment = data.data.submissions;
                if (app.studentSubmissionsForAssignment.length == 0) {
                    app.submission = false;
                } else {
                    app.submission = true;
                }
                app.studentSubmissionsForAssignment.forEach(function(submission) {
                    if (submission.statusString === 'Most Recent' && submission.graded === false) {
                        app.tobeGraded.push(submission);
                    }
                });
                if (app.tobeGraded.length == 0) {
                    app.grading = false;
                } else {
                    app.grading = true;
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    };

    //Grader
    // Function: get all the users from database
    function getUsers() {
        // Runs function to get all the users from database
        app.students = [];

        User.getUsers().then(function(data) {
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                if (data.data.permission === 'faculty') {
                    data.data.users.forEach(function(user) {
                        if (user.permission === "student") {
                            app.students.push(user);
                        }
                    });
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getUsers();

    this.assignGrader = function(graderData) {
        console.log(app.graderData);
        Course.assignGrader(app.graderData).then(function(data) {
            if (data.data.success) {
                Course.getFacultyCourses().then(function(data) {
                    app.facultyCourses = data.data.courses;
                    courses = data.data.courses;
                    $timeout(function() {
                        $location.path('/setGrader');
                    }, 2000);
                    app.succMsg = data.data.message;
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    };
});