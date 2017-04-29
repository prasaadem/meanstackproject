angular.module('adminServices', [])

.factory('Semester', function($http) {
    semsFactory = {};
    semsFactory.createAdminSemester = function(semData) {
        return $http.post('/api/createAdminSemester', semData);
    };

    semsFactory.getAdminSemesters = function() {
        return $http.get('/api/getAdminSemesters/');
    }

    semsFactory.getFacultySemesters = function() {
        return $http.get('/api/getFacultySemesters/');
    }

    semsFactory.getStudentSemesters = function() {
        return $http.get('/api/getStudentSemesters/');
    }

    semsFactory.deleteSemester = function(id) {
        return $http.delete('/api/deleteSemester/' + id);
    };

    semsFactory.deleteCourse = function(id) {
        return $http.delete('/api/deleteCourse/' + id);
    };

    semsFactory.getSemester = function(id) {
        return $http.get('/api/getSemester/' + id);
    };

    semsFactory.updateSemester = function(semData) {
        return $http.put('/api/updateSemester', semData);
    };

    semsFactory.updateCourse = function(courseData) {
        console.log('came');
        return $http.put('/api/updateCourse', courseData);
    };

    semsFactory.getCourse = function(id) {
        return $http.get('/api/getCourse/' + id);
    };

    return semsFactory;
})

.factory('Assignment', function($http) {
    assignmentFactory = {};
    assignmentFactory.createAssignment = function(assignmentData) {
        return $http.post('/api/createAssignment', assignmentData);
    };

    assignmentFactory.getAssignmentsForCourse = function(aData) {
        return $http.post('/api/getAssignmentsForCourse/', aData);
    }

    assignmentFactory.getAFC = function(aData) {
        return $http.post('/api/getAFC/', aData);
    }

    assignmentFactory.getStudentAssignments = function(data) {
        return $http.get('/api/getStudentAssignments');
    };

    // Get user to then edit
    assignmentFactory.getAssignmentForCourseID = function(id) {
        return $http.get('/api/getAssignmentForCourseID/' + id);
    };

    return assignmentFactory;
})

.factory('Submission', function($http) {
    submissionFactory = {};

    submissionFactory.viewAssignmentSubmissions = function(name) {
        return $http.get('/api/viewAssignmentSubmissions/' + name);
    };

    submissionFactory.getSubmissionsForCourse = function(data) {
        return $http.post('/api/getSubmissionsForCourse', data);
    };

    submissionFactory.getStudentsSubmissionsForCourse = function(data) {
        return $http.post('/api/getStudentsSubmissionsForCourse', data);
    };

    submissionFactory.getStudentsSubmissionsForAssignment = function(data) {
        return $http.post('/api/getStudentsSubmissionsForAssignment', data);
    };

    submissionFactory.downloadAssignment = function(data) {
        return $http.post('/api/downloadAssignment/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadOneAssignment = function(data) {
        return $http.post('/api/downloadOneAssignment/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadLatestAssignments = function(data) {
        return $http.post('/api/downloadLatestAssignments/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadIndividualAssignments = function(data) {
        return $http.post('/api/downloadIndividualAssignments/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadCourseAssignments = function(data) {
        return $http.post('/api/downloadCourseAssignments/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.postGradeAndComment = function(data) {
        return $http.post('/api/postGradeAndComment', data);
    };

    // submissionFactory.downloadIndividualAssignments = function(data) {
    //     return $http.post('/api/downloadIndividualAssignments/', data);
    // }

    return submissionFactory;
})

.factory('Course', function($http) {
    courseFactory = {};
    courseFactory.createAdminCourse = function(courseData) {
        return $http.post('/api/course', courseData);
    };

    courseFactory.getAdminCoursesForSem = function(data) {
        return $http.post('/api/getAllCourses/', data);
    };

    courseFactory.getAllCoursesForSem = function(data) {
        return $http.post('/api/getAllCoursesForSem/', data);
    };

    courseFactory.getFacultyCoursesForSem = function(data) {
        return $http.post('/api/getAllCourses/', data);
    };

    courseFactory.getFcfS = function(data) {
        return $http.post('/api/getFacultyCoursesForSem/', data);
    };


    courseFactory.getFacultyCourses = function() {
        return $http.get('/api/getFacultyCourses/');
    }


    courseFactory.takeFacultyCourse = function(courseData) {
        return $http.post('/api/takeFacultyCourse', courseData);
    };

    courseFactory.getStudentCoursesForSem = function(data) {
        return $http.post('/api/getAllCourses/', data);
    };

    courseFactory.takeStudentCourse = function(courseData) {
        console.log('came here');
        return $http.post('/api/takeStudentCourse', courseData);
    };

    courseFactory.getStudentCourses = function(data) {
        return $http.get('/api/getStudentCourses');
    };

    return courseFactory;
});