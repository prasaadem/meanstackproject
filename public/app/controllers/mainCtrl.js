angular.module('mainController',['authServices'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope){
    var app = this;
    app.loadMe = false;
    $rootScope.$on('$routeChangeStart',function(){
        if (Auth.isLoggedIn()) {
            console.log('User is already logged in');
            app.loadMe = true;
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                console.log(data);
                app.username = data.data.username;
                app.userEmail = data.data.email;
            });
        }else{
            console.log('User is not already logged in');
            app.isLoggedIn = false;
            app.loadMe = true;
            app.username = '';
            app.userEmail = '';
        }
    });
    
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
                    app.loginData = '';
                    app.succMsg = '';
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
                    $location.path('/');
                },2000);
    }
});