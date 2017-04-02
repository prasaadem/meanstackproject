angular.module('mainController',['authServices'])
.controller('mainCtrl',function(Auth,$timeout,$location){
    var app = this;

    this.doLogin = function(loginData){
        var app = this;
        app.errorMsg = false;
        app.succMsg = false;
        app.loading = true;
        Auth.login(app.loginData).then(function(data){
            console.log(data.data.success);
            console.log(data.data.message);
            if (data.data.success){
                app.loading = false;
                app.succMsg = data.data.message;
                $timeout(function(){
                    $location.path('/about');
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
});