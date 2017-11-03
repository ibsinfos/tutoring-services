'use strict';
var adminApp = angular.module('administratorApp', [
    'ui.router',
    'ui.router.compat',
    'angularValidator',
    'ngMaterial',
    'authApp',
    'dashboardApp',
    'categoryApp',
    'subjectApp',
    'skillApp',
    'currencyApp',
    'budgetApp',
    'packageApp',
    'projectApp',
    'reasonApp'
]);

authenticateUser.$inject = ['authServices', '$state']

function authenticateUser(authServices, $state) {
    return authServices.checkValidUser(true);
} //END authenticateUser()

adminApp.config(funConfig);
adminApp.run(funRun);
adminApp.component("leftSideBar", {
    templateUrl: 'app/layouts/sidebar-left.html',
    controller: 'AdminController',
    controllerAs: 'admin'
});

// App Config
function funConfig($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {

    $stateProvider
        .state('administrator', {
            url: '',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@administrator': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                },
                // 'sidebarLeft@administrator': {
                //     templateUrl: 'app/layouts/sidebar-left.html'
                // },
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/index.html',
                },
                'footer@administrator': {
                    templateUrl: 'app/layouts/footer.html'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        })
        .state('administrator.dashboard', {
            url: '/dashboard',
            views: {
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/index.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        })
        .state('administrator.profile', {
            url: '/profile',
            views: {
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/profile.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        });

    /* set default date format of angular material datepicker */
    // $mdDateLocaleProvider.formatDate = function(date) {
    //     return moment(date).format('YYYY-MM-DD');
    // };
}


// App Run
funRun.$inject = ['$http', '$rootScope', '$state', '$location', '$log', '$transitions', 'authServices'];

function funRun($http, $rootScope, $state, $location, $log, $transitions, authServices) {
    $rootScope.isLogin = false;

    $rootScope.$on('auth:login:success', function (event, data) {
        $state.go('administrator.dashboard');
    }); // Event fire after login successfully

    $rootScope.$on('auth:access:denied', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after check access denied for user

    $rootScope.$on('auth:login:required', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after logout    

    // $rootScope.$on('$locationChangeStart', function (event, next, current) {
    //     var restrictedPage = $.inArray($location.path(), ['/admin/auth/login', '/admin/auth/forgot-password']) === -1;
    //     var loggedIn = $rootScope.isLogin;
    //     if (!loggedIn) {
    //         // $location.path('/admin/dashboard');
    //         // //$state.go('administrator.dashboard');
    //         // return false;
    //         $state.go('auth.login');
    //         return false;
    //     }
    // });

    $transitions.onStart({
        to: '**'
    }, function ($transition$) {
        console.log('Transition #' + $transition$.$id + ': B) onStart to: ' + $transition$.to().name);
    });
}