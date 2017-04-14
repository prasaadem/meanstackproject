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

   return assignmentFactory;
})


.factory('Course',function($http){
    courseFactory= {};
    courseFactory.createCourse = function(courseData){
        return $http.post('/api/course',courseData);
    };

    semFactory.getCourses = function(){
        return $http.get('/api/getCourses/');
    };

    courseFactory.takeCourse = function(data){
        console.log('came here');
        return $http.put('/api/takeCourse',data);
    };

   return courseFactory;
});

