var app = angular.module('appRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './app/views/pages/home.html'
            })

        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })

        .when('/register', {
            templateUrl: 'app/views/pages/users/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            authenticated: false
        })

        .when('/login', {
            templateUrl: 'app/views/pages/users/login.html',
            authenticated: false
        })

        .when('/logout', {
            templateUrl: 'app/views/pages/users/logout.html',
            authenticated: true
        })

        .when('/profile', {
            templateUrl: 'app/views/pages/users/profile.html',
            authenticated: true
        })

        .when('/management', {
            templateUrl: 'app/views/pages/management/management.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/facultyManagement', {
            templateUrl: 'app/views/pages/management/facultyManagement.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        // Route: Edit a User
        .when('/edit/:id', {
            templateUrl: 'app/views/pages/management/edit.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        // Route: Edit a User
        .when('/editSemester/:id', {
            templateUrl: 'app/views/pages/management/admin/editSemester.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/editCourse/:id', {
            templateUrl: 'app/views/pages/management/admin/editCourse.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/addSemester', {
            templateUrl: 'app/views/pages/management/admin/addSemester.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/showSemester', {
            templateUrl: 'app/views/pages/management/admin/showSemester.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/addCourse', {
            templateUrl: 'app/views/pages/management/admin/addCourse.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/showCourse', {
            templateUrl: 'app/views/pages/management/admin/showCourse.html',
            controller: 'adminCtrl',
            controllerAs: 'admin',
            authenticated: true,
            permission: ['admin']
        })

        .when('/takeCourse', {
            templateUrl: 'app/views/pages/management/faculty/takeCourse.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/myCourses', {
            templateUrl: 'app/views/pages/management/faculty/myCourses.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/setGrader', {
            templateUrl: 'app/views/pages/management/faculty/setGrader.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/viewCourse/:id', {
            templateUrl: 'app/views/pages/management/faculty/viewCourse.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/viewAssignmentSubmissions/:assId', {
            templateUrl: 'app/views/pages/management/faculty/viewAssignmentSubmissions.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/newAssignment', {
            templateUrl: 'app/views/pages/management/faculty/newAssignment.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/editAssignment', {
            templateUrl: 'app/views/pages/management/faculty/editAssignment.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/viewAssignments', {
            templateUrl: 'app/views/pages/management/faculty/viewAssignments.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/viewStudentSubmissions', {
            templateUrl: 'app/views/pages/management/faculty/viewSubmissions.html',
            controller: 'facultyCtrl',
            controllerAs: 'faculty',
            authenticated: true,
            permission: ['faculty']
        })

        .when('/takeStudentCourse', {
            templateUrl: 'app/views/pages/management/student/takeCourse.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })

        .when('/studentCourses', {
            templateUrl: 'app/views/pages/management/student/myCourses.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })

        .when('/submission', {
            templateUrl: 'app/views/pages/management/student/submission.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })

        .when('/viewSubmissions', {
            templateUrl: 'app/views/pages/management/student/viewSubmissions.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })

        .when('/viewStudentAssignments', {
            templateUrl: 'app/views/pages/management/student/viewAssignments.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })

        .when('/grader', {
            templateUrl: 'app/views/pages/management/student/grader.html',
            controller: 'studentCtrl',
            controllerAs: 'student',
            authenticated: true,
            permission: ['student']
        })



        .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
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