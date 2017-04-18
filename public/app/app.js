angular.module('userApp',['appRoutes','userController','userServices','mainController','authServices','managementController','semesterController','adminController','facultyController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});