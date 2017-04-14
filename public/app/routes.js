var app = angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider){
    $routeProvider
    .when('/',{
        templateUrl: 'app/views/pages/home.html'
    })

    .when('/about',{
        templateUrl: 'app/views/pages/about.html'
    })

    .when('/register',{
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated: false
    })

    .when('/login',{
        templateUrl: 'app/views/pages/users/login.html',
        authenticated: false
    })

    .when('/logout',{
        templateUrl: 'app/views/pages/users/logout.html',
        authenticated: true
    })

    .when('/profile',{
        templateUrl: 'app/views/pages/users/profile.html',
        authenticated: true
    })

    .when('/management',{
        templateUrl: 'app/views/pages/management/management.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin']
    })

    .when('/facultyManagement',{
        templateUrl: 'app/views/pages/management/facultyManagement.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin']
    })

    // Route: Edit a User
    .when('/edit/:id', {
        templateUrl: 'app/views/pages/management/edit.html',
        controller: 'editCtrl',
        controllerAs: 'edit',
        authenticated: true,
        permission: ['admin', 'faculty']
    })

    // Route: Search Database Users
    .when('/search', {
        templateUrl: 'app/views/pages/management/search.html',
        controller: 'managementCtrl',
        controllerAs: 'management',
        authenticated: true,
        permission: ['admin', 'faculty']
    })

    .when('/addSemester',{
        templateUrl: 'app/views/pages/management/addSemester.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['admin']
    })

    .when('/showSemester',{
        templateUrl: 'app/views/pages/management/showSemester.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['admin']
    })

    .when('/addCourse',{
        templateUrl: 'app/views/pages/management/addCourse.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['admin']
    })

    .when('/showCourse',{
        templateUrl: 'app/views/pages/management/showCourse.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        // permission: ['admin','faculty', 'student']
    })

    .when('/takeCourse',{
        templateUrl: 'app/views/pages/management/takeCourse.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['faculty', 'student']
    })

    .when('/myCourses',{
        templateUrl: 'app/views/pages/management/myCourses.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['faculty']
    })

    .when('/viewCourse/:id', {
        templateUrl: 'app/views/pages/management/viewCourse.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['faculty']
    })

    .when('/newAssignment',{
        templateUrl: 'app/views/pages/management/newAssignment.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['faculty']
    })

    .when('/viewAssignments',{
        templateUrl: 'app/views/pages/management/viewAssignments.html',
        controller: 'semesterCtrl',
        controllerAs: 'semester',
        authenticated: true,
        permission: ['faculty']
    })

    .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode({
        enabled:true,
        requireBase: false
    });
    
});


app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

        // Only perform if user visited a route listed above
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if (next.$$route.authenticated === true) {
                // Check if authentication is required, then if permission is required
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                } else if (next.$$route.permission) {
                    // Function: Get current user's permission to see if authorized on route
                    User.getPermission().then(function(data) {
                        // Check if user's permission matches at least one in the array
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault(); // If at least one role does not match, prevent accessing route
                                $location.path('/'); // Redirect to home instead
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }
    });
}]);
