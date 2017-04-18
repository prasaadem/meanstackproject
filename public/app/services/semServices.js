angular.module('semServices',[])
.factory('Semester',function($http){
    semFactory= {};
    semFactory.createSemester = function(semData){
        return $http.post('/api/sem',semData);
    };

    semFactory.getSemesters = function(){
        return $http.get('/api/getSems/');
    }

   return semFactory;
})

.factory('Assignment',function($http){
    assignmentFactory= {};
    assignmentFactory.createAssignment = function(assignmentData){
        return $http.post('/api/createAssignment',assignmentData);
    };

    assignmentFactory.getAssignmentsForCourse = function(assignmentData){
        return $http.post('/api/getAssignmentsForCourse/',assignmentData);
    }

    // // Delete a user
    // assignmentFactory.upload = function() {
    //     return $http.post('/api/upload/');
    // };

   return assignmentFactory;
})


.factory('Course',function($http){
    courseFactory= {};
    courseFactory.createCourse = function(courseData){
        return $http.post('/api/course',courseData);
    };

    courseFactory.getCoursesForSem = function(data){
        return $http.post('/api/getAllCourses/',data);
    };

    courseFactory.getFacultyCourses = function(){
        return $http.get('/api/getFacultyCourses/');
    };

    courseFactory.getStudentCourses = function(){
        return $http.get('/api/getStudentCourses/');
    };

    courseFactory.getFacultyAssignmentsForCourseId = function(){
        return $http.get('/api/getFacultyAssignmentsForCourseId/');
    };


    courseFactory.takeCourse = function(courseData){
        return $http.post('/api/takeCourse',courseData);
    };

    // courseFactory.setAssignmentForCourse = function(data){
    //     return $http.put('/api/setAssignmentForCourse',data);
    // };



   return courseFactory;
});

