angular.module('studentController', ['adminServices', 'fileModelDirective', 'uploadFileService'])

.controller('studentCtrl', function($http, $location, $timeout, Semester, Course, User, Submission, $scope, $routeParams, Assignment, uploadFile) {

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
            Assignment.getAFC(course).then(function(data) {
                if (data.data.success) {
                    $scope.courseAssignments = data.data.assignments;
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
            Submission.getSubmissionsForCourse(course).then(function(data) {
                if (data.data.success) {
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

    $scope.file = {};
    $scope.Submit = function() {
        $scope.uploading = true;
        var formData = new FormData();

        var file = $('#file')[0].files[0];
        formData.append('myfile', file);

        for (key in $scope.assignmentData) {
            // console.log($scope.assignmentData[key] + '******* key');
            formData.append(key, $scope.assignmentData[key]);
        }

        uploadFile.upload(formData).then(function(data) {
            if (data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                app.succMsg = 'Submitted Assignment';
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.errMsg = 'Submission failed';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };

    this.getCoursesForSem = function(data) {
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        Course.getStudentCoursesForSem(app.data).then(function(data) {
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

    function getSemesters() {
        Semester.getStudentSemesters().then(function(data) {
            if (data.data.success) {
                app.sems = data.data.sems;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getSemesters();

    function getStudentCourses() {
        Course.getStudentCourses().then(function(data) {
            if (data.data.success) {
                app.studentCourses = data.data.courses;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getStudentCourses();

    function getStudentAssignments() {
        Assignment.getStudentAssignments().then(function(data) {
            if (data.data.success) {
                app.studentAssignments = data.data.assignments;
            } else {
                app.errorMsg = data.data.message; // Set error message
                app.loading = false; // Stop loading icon
            }
        });
    }
    getStudentAssignments();

});