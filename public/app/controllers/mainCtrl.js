angular.module('mainController',['authServices','userServices'])
.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$interval,$window, $route,User, AuthToken){
    var app = this;
    app.loadMe = false;

    app.checkSession = function(){
        if (Auth.isLoggedIn()) {
            app.checkingSession = true;
            var interval = $interval(function(){
                var token = $window.localStorage.getItem('token');
                if (token === null) {
                    $interval.cancel(interval);
                }else{
                    self.parseJwt = function(token){
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-','+').replace('_','/');
                        return JSON.parse($window.atob(base64));
                    }
                    var expireTime = self.parseJwt(token);
                    var timeStamp = Math.floor(Date.now()/1000);
                    var timeCheck = expireTime.exp - timeStamp;
                    if (timeCheck <=  25) {
                        console.log('Token has expired');
                        showModal(1);
                        $interval.cancel(interval);
                    }else{
                        console.log('Token not expired');
                    }
                }
            },2000);
        }
    };

    app.checkSession();

    var showModal = function(option){

        app.choiceMade = false;
        app.modalHeader = undefined;
        app.modalBody = undefined;
        app.hideButton = false;

        if (option === 1) {
            app.modalHeader = 'Timeout warning';
            app.modalBody = 'Your session will expire in  5 minutes, would you like to renew your session?';
            $("#myModal").modal({backdrop: "static"});
        }else if (option === 2) {
            app.modalHeader = 'Logging Out!!';
            app.hideButton = true;
            $("#myModal").modal({backdrop: "static"});
            
            $timeout(function(){
                Auth.logout();
                $location.path('/logout');
                },2000);
                hideModal();
        }
        $timeout(function(){
            if (!app.choiceMade) {
                    hideModal();
                }
            }, 4000); 
    };

    app.renewSession = function(){
        app.choiceMade = true;
        User.renewSession(app.username).then(function(data){
            console.log(data);
            if (data.data.success) {
                AuthToken.setToken(data.data.token); 
                app.checkSession();
            }else{
                app.modalBody = data.data.message;
            }
        });
        hideModal();
    };

    app.endSession=function(){
        app.choiceMade = true;
        hideModal();
        $timeout(function(){
            showModal(2);
            }, 1000); 
    };

    var hideModal = function(){
        $("#myModal").modal('hide');
    };

    $rootScope.$on('$routeChangeStart',function(){

        if (!app.checkSession) {
            app.checkSession();
        }

        if (Auth.isLoggedIn()) {
            console.log('User is already logged in');
            app.loadMe = true;
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                app.username = data.data.username;
                app.userEmail = data.data.email;
                User.getPermission().then(function(data){
                    if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                        app.authorized = true;
                        app.loadMe = true;
                    }else{
                        app.authorized = false;
                        app.loadMe = true;
                    }
                });
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
                    app.checkSession();
                },2000);
            }else{
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    app.logout = function(){
        showModal(2);
    };
});