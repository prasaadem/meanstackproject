angular.module('userServices', [])
    .factory('User', function($http) {
        userFactory = {};

        userFactory.create = function(regData) {
            return $http.post('/api/users', regData);
        };

        userFactory.checkUsername = function(regData) {
            return $http.post('/api/checkusername', regData);
        };

        userFactory.checkEmail = function(regData) {
            return $http.post('/api/checkemail', regData);
        };

        userFactory.renewSession = function(username) {
            return $http.get('/api/renewToken/' + username);
        };

        userFactory.getPermission = function() {
            return $http.get('/api/permission/');
        };

        userFactory.getUsers = function() {
            return $http.get('/api/management/');
        };

        // Get user to then edit
        userFactory.getUser = function(id) {
            return $http.get('/api/edit/' + id);
        };

        // Delete a user
        userFactory.deleteUser = function(username) {
            return $http.delete('/api/management/' + username);
        };

        userFactory.updateUser = function(userData) {
            return $http.put('/api/updateUser', userData);
        };

        return userFactory;
    });