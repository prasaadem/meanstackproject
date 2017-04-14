angular.module('semServices',[])
.factory('Semester',function($http){
    semFactory= {};
    semFactory.createSem = function(semData){
        return $http.post('/api/sem',semData);
    };

    semFactory.getSemesters = function(){
        return $http.get('/api/getSems/');
    }

   return semFactory;
})

.factory('Assignment',function($http){
    assignmentFactory= {};
    assignmentFactory.createAssignment = function(data){
        return $http.post('/api/createAssignment',data);
    };

    assignmentFactory.getAssignments = function(){
        return $http.get('/api/getAssignments/');
    }

    // Delete a user
    assignmentFactory.upload = function() {
        return $http.post('/api/upload/');
    };

   return assignmentFactory;
})


.factory('Course',function($http){
    courseFactory= {};
    courseFactory.createCourse = function(courseData){
        return $http.post('/api/course',courseData);
    };

    courseFactory.getCourses = function(){
        return $http.get('/api/getCourses/');
    };

    courseFactory.takeCourse = function(data){
        return $http.put('/api/takeCourse',data);
    };

    courseFactory.setAssignmentForCourse = function(data){
        return $http.put('/api/setAssignmentForCourse',data);
    };



   return courseFactory;
});

