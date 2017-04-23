angular.module('uploadFileService', [])

.service('uploadFile', function($http) {
    this.upload = function(formData) {
        var fd = formData;
        return $http.post('/api/upload', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };
});