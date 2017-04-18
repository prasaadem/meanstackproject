angular.module('facultyServices',[])
.factory('Semester',function($http){
    semFactory= {};

    semFactory.getSemesters = function(){
        return $http.get('/api/getSems/');
    }

   return semFactory;
})


.factory('Course',function($http){
    courseFactory= {};

    courseFactory.getAdminCourses = function(){
        return $http.get('/api/getAdminCourses/');
    };

    courseFactory.takeCourse = function(courseData){
        return $http.post('/api/takeCourse',courseData);
    };
    
   return courseFactory;
});