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

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.storeIdExpanded = "";
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
            Course.getFcfS(sem).then(function(data) {
                if (data.data.success) {
                    app.loading = false;
                    app.succMsg = data.data.message;
                    $scope.courses = data.data.courses;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        }
    };

    $scope.assignment = function(index, course) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            Assignment.getAFC(course).then(function(data) {
                if (data.data.success) {
                    app.submissionCount = [];
                    $scope.courseAssignments = data.data.assignments;
                    $scope.courseAssignments.forEach(function(assignment) {
                        if (assignment.submissions.length === 0) {
                            app.submissionCount.push(0);
                        } else {
                            app.submissionCount.push(assignment.submissions.length);
                        }
                    }, this);
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.loading = false; // Stop loading icon
                }
            });
        }
    };

    $scope.submission = function(index, course) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            Submission.getStudentsSubmissionsForCourse(course).then(function(data) {
                if (data.data.success) {
                    console.log(data.data.submissions);
                    $scope.courseSubmissions = data.data.submissions;
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.loading = false; // Stop loading icon
                }
            });
        }
    };;

    $scope.showSubmissions = function(index, assignment) {
        console.log(index);
        Submission.getStudentsSubmissionsForAssignment(assignment).then(function(data) {
            if (data.data.success) {
                console.log(data.data.submissions);
                app.studentSubmissionsForAssignment = data.data.submissions;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    };

    $scope.facultydownload = function(index, submission) {
        var app = this;
        console.log(submission);
        app.name = submission.courseName + '-' + submission.assignment;
        Submission.downloadAssignment(app.submission).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadCourseAssignments = function(index, course) {
        var app = this;
        console.log(course);
        app.name = course.semesterName + '-' + course.title;
        Submission.downloadCourseAssignments(app.course).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadIndividualAssignments = function(index, assignment) {
        var app = this;
        app.name = assignment.courseName + '-' + assignment.name;
        Submission.downloadIndividualAssignments(app.assignment).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadLatestAssignments = function(index, assignment) {
        var app = this;
        app.name = assignment.courseName + '-' + assignment.name;
        Submission.downloadLatestAssignments(app.assignment).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }


    $scope.downloadOneAssignment = function(index, submission) {
        var app = this;
        console.log(submission);
        app.name = submission.fileName;
        Submission.downloadOneAssignment(app.submission).then(function(data) {
            var file = new Blob([(data.data)]);
            console.log(file.size);
            saveAs(file, app.name);
        });
    }

    function str2bytes(str) {
        var bytes = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes;
    }

    $scope.download = function() {
        window.open('/studentDownload');
    }

    this.getCoursesForSem = function(data) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Course.getFacultyCoursesForSem(app.data).then(function(data) {
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

    this.createAssignment = function(assignmentData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Assignment.createAssignment(app.assignmentData).then(function(data) {
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success) {
                app.loading = false;
                app.succMsg = data.data.message;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    this.getAssignmentsForCourse = function(aData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Assignment.getAssignmentsForCourse(app.aData).then(function(data) {
            if (data.data.success) {
                app.courseAssignments = data.data.assignments;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }

    function getSemesters() {
        Semester.getFacultySemesters().then(function(data) {
            if (data.data.success) {
                app.sems = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getSemesters();

    function getFacultyCourses() {
        Course.getFacultyCourses().then(function(data) {
            if (data.data.success) {
                app.facultyCourses = data.data.courses;
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
                    }
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getCourseFromId();

    Assignment.getAssignmentForCourseID($routeParams.id).then(function(data) {

        if (data.data.success) {
            app.courseAssignments = data.data.assignments;
        } else {
            app.errorMsg = data.data.message; // Set error message
            app.loading = false; // Stop loading icon
        }
    });

    Submission.viewAssignmentSubmissions($routeParams.name).then(function(data) {
        if (data.data.success) {
            $scope.assignmentSubmissionsId = data.data.submissions;
        } else {
            app.errorMsg = data.data.message; // Set error message
            app.loading = false; // Stop loading icon
        }
    });

    this.grade = function(gradeData) {
        Submission.postGradeAndComment(gradeData).then(function(data) {
            if (data.data.success) {
                $scope.assignmentSubmissionsId = data.data.submissions;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    };
});