var authApp = angular.module('authApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator'
]);

authenticateUser1.$inject = ['authServices', '$state']

function authenticateUser1(authServices, $state) {
    return authServices.checkValidUser(false);
} //END authenticateUser()

authApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('auth', {
            url: '/auth',
            views: {
                '': {
                    templateUrl: 'app/layouts/auth/layout.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        })
        .state('auth.login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: 'app/layouts/auth/layout.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        })
        .state('auth.forgotpassword', {
            url: '/forgot-password',
            views: {
                'content@auth': {
                    templateUrl: 'app/components/auth/forgotpassword.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        });
});