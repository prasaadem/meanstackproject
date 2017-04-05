angular.module('userController',['userServices'])
.controller('regCtrl', function($http,$location,$timeout,User){
    this.regUser = function(regData,valid){
        var app = this;
        app.errorMsg = false;
        app.loading = true;

        if (valid) {
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
        }else{
            app.loading = false;
            app.errorMsg = 'Please ensure form is filled out properly!';
        }
    }

    this.checkUsername = function(regData){
        
        var app = this;

        app.usernameMsg = false;
        app.usernameInvalid = false;
        app.checkingUsername = true;

        User.checkUsername(app.regData).then(function(data){
            if (data.data.success){
                app.checkingUsername = false;
                app.usernameInvalid = false;
                app.usernameMsg = data.data.message;
            }else{
                app.checkingUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            }
        });
    }

    this.checkEmail = function(regData){
        
        var app = this;

        app.emailMsg = false;
        app.emailInvalid = false;
        app.checkingEmail = true;

        User.checkEmail(app.regData).then(function(data){
            if (data.data.success){
                app.checkingEmail = false;
                app.emailInvalid = false;
                app.emailMsg = data.data.message;
            }else{
                app.checkingEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        });
    }
});
