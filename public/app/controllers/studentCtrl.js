var sems = [];
var courses = [];

angular.module('studentController', ['adminServices', 'fileModelDirective', 'uploadFileService'])

.controller('studentCtrl', function($http, $location, $sce, $timeout, Semester, Course, User, Submission, $scope, $routeParams, Assignment, uploadFile, $window) {

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

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.storeIdExpanded = "";
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

    //Course
    this.takeStudentCourse = function(courseData) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Course.takeStudentCourse(app.courseData).then(function(data) {
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

    function getStudentCourses() {
        Course.getStudentCourses().then(function(data) {
            if (data.data.success) {
                app.studentCourses = data.data.courses;
                courses = data.data.courses;
                app.studentAssignments = [];
                courses.forEach(function(course) {
                    course.assignments.forEach(function(assignment) {
                        assignmentDict = {};
                        assignmentDict.courseName = course.title;
                        assignmentDict.assignment = assignment;
                        app.studentAssignments.push(assignmentDict);
                    });
                });
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getStudentCourses();

    $scope.dayDataCollapseFn = function(index, sem) {
        for (var i = 0; storeDataModel.storedata.length - 1; i += 1) {
            $scope.dayDataCollapse.append('false');
        }
    };

    $scope.assignment = function(index, course) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            courses.forEach(function(c) {
                if (c._id === course._id) {
                    $scope.courseAssignments = c.assignments;
                }
            });
        }
    };


    //Submissions
    $scope.file = {};
    $scope.Submit = function() {
        app.errorMsg = '';
        var formData = new FormData();

        var file = $('#file')[0].files[0];
        formData.append('myfile', file);

        for (key in $scope.assignmentData) {
            formData.append(key, $scope.assignmentData[key]);
        }
        if (file.size <= 10000000) {
            $scope.uploading = true;
            uploadFile.upload(formData).then(function(data) {
                if (data.data.success) {
                    $scope.uploading = false;
                    $scope.alert = 'alert alert-success';
                    app.succMsg = 'Submitted Assignment';
                    $scope.file = {};
                } else {
                    $scope.uploading = false;
                    $scope.errerrorMsgMsg = 'Submission failed';
                    $scope.message = data.data.message;
                    $scope.file = {};
                }
            });
        } else {
            app.errorMsg = 'File size more than 10MB';
        }
    };

    $scope.fileChanged = function(files) {
        if (files.length > 0) {
            var file = files[0];
            app.filesize = file.size;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = $sce.trustAsResourceUrl(e.target.result);
                });
            }
        } else {
            $scope.thumbnail = {};
        }
    };

    var fileReader = function($q, $log) {

        var onLoad = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function(event) {
                scope.$broadcast("fileProgress", {
                    total: event.total,
                    loaded: event.loaded
                });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function(file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    };

    $scope.submission = function(index, course) {
        if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
        } else {
            $scope.dayDataCollapse[$scope.previousIndex] = false;
            $scope.previousIndex = index;
            $scope.dayDataCollapse[index] = !$scope.dayDataCollapse[index];
            Submission.getSubmissionsForCourse(course).then(function(data) {
                if (data.data.success) {
                    console.log(data.data.submissions);
                    $scope.courseSubmissions = data.data.submissions;
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.loading = false; // Stop loading icon
                }
            });
        }
    };

    $scope.downloadAssignment = function(index, submission) {
        var app = this;
        console.log(submission);
        app.name = submission.fileName;
        Submission.downloadAssignment(app.submission).then(function(data) {
            var file = new Blob([(data.data)]);
            console.log(file.size);
            saveAs(file, app.name);
        });
    }

    //Grader

    function getGraderCourse() {
        Course.getGraderCourse().then(function(data) {
            if (data.data.success) {
                app.gradingCourse = data.data.course;
                console.log(app.gradingCourse);
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getGraderCourse();

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


    //Download
    $scope.downloadCourseAssignments = function(index, course) {
        var app = this;
        app.name = course.semester.title + '-' + course.title;
        Submission.downloadCourseAssignments(course).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadIndividualAssignments = function(index, assignment) {
        var app = this;
        app.name = assignment.name;
        Submission.downloadIndividualAssignments(assignment).then(function(data, status, headers, config) {
            var file = new Blob([(data.data)], { type: "application/zip" });
            console.log(file.size);
            saveAs(file, app.name + ".zip");
        });
    }

    $scope.downloadOneAssignment = function(index, submission) {
        var app = this;
        app.name = submission.fileName;
        Submission.downloadOneAssignment(submission).then(function(data) {
            var file = new Blob([(data.data)]);
            console.log(file.size);
            saveAs(file, app.name);
        });
    }
});