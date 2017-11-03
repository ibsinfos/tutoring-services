var authApp = angular.module('authApp', [
    'ui.router',
    'ui.router.compat'
]);

authenticateNotLoggedInUser.$inject = ['authServices', '$state']

function authenticateNotLoggedInUser(authServices, $state) {
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
                'header@auth': {
                    templateUrl: 'app/layouts/header.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/signin.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                },
                'footer@auth': {
                    templateUrl: 'app/layouts/footer.html'
                },
            },
            resolve: {
                auth: authenticateNotLoggedInUser
            }
        })
        .state('auth.login', {
            url: '/sign-in',
            views: {
                '': {
                    templateUrl: 'app/layouts/auth/layout.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/signin.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            }
        })
        .state('auth.freelancerRegister', {
            url: '/become-a-freelancer',
            views: {
                'content@auth': {
                    templateUrl: 'app/components/auth/become-a-freelancer.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            }
        })
        .state('auth.employerRegister', {
            url: '/become-an-employer',
            views: {
                'content@auth': {
                    templateUrl: 'app/components/auth/become-an-employer.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            }
        })
        .state('auth.forgotpassword', {
            url: '/forgot-password',
            views: {
                'content@auth': {
                    templateUrl: 'app/components/auth/forgot-password.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth: authenticateNotLoggedInUser
            }
        });
});