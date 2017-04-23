angular.module('userApp', ['appRoutes', 'userController', 'userServices', 'mainController', 'authServices', 'managementController', 'adminController', 'adminServices', 'facultyController', 'studentController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});