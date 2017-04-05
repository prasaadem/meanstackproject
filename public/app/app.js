angular.module('userApp',['appRoutes','userController','userServices','mainController','authServices','managementController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});