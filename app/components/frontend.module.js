var frontendApp = angular.module('frontendApp', [
    'ui.router',
    'ui.router.compat',
    'toastr',
    'authApp',
    'sharedApp',
    'homeApp',
    'freelancerApp',
    'employerApp',
    'searchApp',
    'projectApp',
    'profileApp',
    'paymentApp'
]);


authenticateUser.$inject = ['authServices', '$state']

function authenticateUser(authServices, $state) {
    return authServices.checkValidUser(true);
} //END authenticateUser()

frontendApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@root': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                },
                'content@root': {
                    templateUrl: 'app/components/home/index.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                },
            }            
        })
        .state('root.dashboard', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@root': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                },
                'content@root': {
                    templateProvider: ['$templateRequest', '$rootScope', 'APPCONFIG', function (templateRequest, $rootScope, APPCONFIG) {
                        var user = $rootScope.user;
                        var templateUrl = '';

                        if (user.role_id == APPCONFIG.FREELANCER_ROLE) {
                            // Freelancer Template
                            templateUrl = 'app/components/freelancer/dashboard.html'
                        } else if (user.role_id == APPCONFIG.EMPLOYER_ROLE) {
                            // Employer Template
                            templateUrl = 'app/components/employer/dashboard.html'
                        }

                        return templateRequest(templateUrl);
                    }],
                    controllerProvider: ['$rootScope', 'APPCONFIG', function ($rootScope, APPCONFIG) {
                        var user = $rootScope.user;
                        var controllerName = '';

                        if (user.role_id == APPCONFIG.FREELANCER_ROLE) {
                            // Freelancer Controller
                            controllerName = 'FreelancerController as freelancer';
                        } else if (user.role_id == APPCONFIG.EMPLOYER_ROLE) {
                            // Employer Controller
                            controllerName = 'EmployerController as employer';
                        }

                        return controllerName;
                    }]
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                },
            },
            resolve: {
                auth: authenticateUser
            }
        })
        .state('root.profile', {
            url: 'profile/:slug',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@root': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                },
                'content@root': {
                    templateUrl: 'app/components/profile/freelancer.html',
                    controller: 'ProfileController',
                    controllerAs: 'profile',
                    params: {
                        'slug': ''
                    }
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        })
        .state('root.search', {
            url: 'search?area&budgettype&budget&urgency&skillmatch',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@root': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                },
                'content@root': {
                    templateUrl: 'app/components/search/index.html',
                    controller: 'SearchController',
                    controllerAs: 'search',
                    params: {
                        'area': '',
                        'budgettype': '',
                        'budget': '',
                        'urgency': '',
                        'skillmatch': ''
                    }
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        });
});

frontendApp.run(funRun);

frontendApp.component("footerComponent", {
    templateUrl: 'app/layouts/footer.html',
    controller: 'FrontendController',
    controllerAs: 'footer'
});

frontendApp.component("popupsComponent", {
    templateUrl: 'app/layouts/popups.html',
    controller: 'FrontendController',
    controllerAs: 'popup'
});

// App Run
funRun.$inject = ['$http', '$rootScope', '$state', '$location', '$log', '$transitions', 'authServices'];

function funRun($http, $rootScope, $state, $location, $log, $transitions, authServices) {
    $rootScope.isLogin = false;

    $rootScope.$on('auth:login:success', function (event, data) {
        $state.go('root');
    }); // Event fire after login successfully

    $rootScope.$on('auth:access:denied', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after check access denied for user

    $rootScope.$on('auth:login:required', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after logout    

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $rootScope.currentStateName = $state.current.name;
    }); // Checking State for Footer Links for Non Logged In Users

    $transitions.onStart({
        to: '**'
    }, function ($transition$) {
        console.log('Transition #' + $transition$.$id + ': B) onStart to: ' + $transition$.to().name);
    });
}