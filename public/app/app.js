angular.module('userApp',['appRoutes','userController','userServices','mainController','authServices','managementController','semesterController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});