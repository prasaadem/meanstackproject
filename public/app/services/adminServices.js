angular.module('adminServices', [])

.factory('Semester', function($http) {
    semsFactory = {};

    //Admin Services
    semsFactory.createSemester = function(semData) {
        return $http.post('/api/createSemester', semData);
    };

    semsFactory.getSemesters = function() {
        return $http.get('/api/getSemesters/');
    }

    semsFactory.updateSemester = function(semData) {
        return $http.put('/api/updateSemester', semData);
    };

    semsFactory.deleteSemester = function(id) {
        return $http.delete('/api/deleteSemester/' + id);
    };

    return semsFactory;
})

.factory('Assignment', function($http) {
    assignmentFactory = {};

    assignmentFactory.createAssignment = function(assignmentData) {
        return $http.post('/api/createAssignment', assignmentData);
    };

    assignmentFactory.getAssignments = function() {
        return $http.get('/api/getAssignments/');
    }

    assignmentFactory.updateAssignment = function(data) {
        return $http.put('/api/updateAssignment', data);
    };

    return assignmentFactory;
})

.factory('Submission', function($http) {
    submissionFactory = {};

    //Faculty Services
    submissionFactory.getStudentsSubmissionsForAssignment = function(data) {
        return $http.post('/api/getStudentsSubmissionsForAssignment', data);
    };

    submissionFactory.downloadCourseAssignments = function(data) {
        return $http.post('/api/downloadCourseAssignments/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadIndividualAssignments = function(data) {
        return $http.post('/api/downloadIndividualAssignments/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.downloadOneAssignment = function(data) {
        return $http.post('/api/downloadOneAssignment/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    submissionFactory.postGradeAndComment = function(data) {
        return $http.post('/api/postGradeAndComment', data);
    };

    //Student Services
    submissionFactory.getSubmissionsForCourse = function(data) {
        return $http.post('/api/getSubmissionsForCourse', data);
    };

    submissionFactory.downloadAssignment = function(data) {
        return $http.post('/api/downloadAssignment/', data, { encoding: null, responseType: 'arraybuffer' });
    }

    return submissionFactory;
})

.factory('Course', function($http) {
    courseFactory = {};

    //Admin Service
    courseFactory.createCourse = function(courseData) {
        return $http.post('/api/createCourse', courseData);
    };

    courseFactory.updateCourse = function(courseData) {
        return $http.put('/api/updateCourse', courseData);
    };

    courseFactory.deleteCourse = function(id) {
        return $http.delete('/api/deleteCourse/' + id);
    };

    //Faculty Service
    courseFactory.takeFacultyCourse = function(courseData) {
        return $http.post('/api/takeFacultyCourse', courseData);
    };

    courseFactory.getFacultyCourses = function() {
        return $http.get('/api/getFacultyCourses/');
    };

    courseFactory.assignGrader = function(graderData) {
        return $http.post('/api/assignGrader', graderData);
    };

    //Student Service
    courseFactory.takeStudentCourse = function(courseData) {
        return $http.post('/api/takeStudentCourse', courseData);
    };

    courseFactory.getStudentCourses = function(data) {
        return $http.get('/api/getStudentCourses');
    };

    courseFactory.getGraderCourse = function(data) {
        return $http.get('/api/getGraderCourse');
    };

    return courseFactory;
});