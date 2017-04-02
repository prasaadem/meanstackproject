angular.module('userController',['userServices'])
.controller('regCtrl', function($http,$location,$timeout,User){
    this.regUser = function(regData){
        var app = this;
        app.errorMsg = false;
        app.loading = true;
        User.create(app.regData).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
});
