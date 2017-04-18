angular.module('adminServices',[])
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


.factory('Course',function($http){
    courseFactory= {};
    courseFactory.createCourse = function(courseData){
        return $http.post('/api/course',courseData);
    };

    courseFactory.getAdminCourses = function(){
        return $http.get('/api/getAdminCourses/');
    };
    
   return courseFactory;
});