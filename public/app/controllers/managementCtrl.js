angular.module('managementController',[])
.controller('managementCtrl',function(User){
    var app = this;
    app.loading = true;
    app.accessDenied = true;
    app.editAccess = false;
    app.deleteAccess = false;
    app.limit = 100;
    User.getUsers().then(function(data){
        if (data.data.success) {
            if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                app.users = data.data.users;
                app.loading = false;
                app.accessDenied = false;
                if (data.data.permission === 'admin') {
                    app.editAccess = true;
                    app.deleteAccess = true;
                }else if(data.data.permission === 'moderator'){
                    app.editAccess = true;
                    app.deleteAccess = false;
                }
            }else{
                app.errorMsg = 'Insufficient permission';
                app.loading = false;
            }
        }else{
            app.errorMsg = data.data.message;
            app.loading = false;
        }
    }); 
})
