var paymentApp = angular.module('paymentApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator',
    'angucomplete-alt',
    'ngSanitize',
    'paypal-button'
]);

paymentApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root.payWeekly', {
            url: 'pay-weekly/:projectSlug/:userSlug',
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
                    templateUrl: 'app/components/payment/pay-weekly.html',
                    controller: 'PaymentController',
                    controllerAs: 'payWeekly',
                    params: {
                        'projectSlug': '',
                        'userSlug': ''
                    }
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        })
        .state('root.payComplete', {
            url: 'pay-complete/:projectSlug/:userSlug',
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
                    templateUrl: 'app/components/payment/pay-complete.html',
                    controller: 'PaymentController',
                    controllerAs: 'payComplete',
                    params: {
                        'projectSlug': '',
                        'userSlug': ''
                    }
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        })
        .state('root.payNow', {
            url: 'pay-now/:projectSlug/:userSlug',
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
                    templateUrl: 'app/components/payment/pay-now.html',
                    controller: 'PaymentController',
                    controllerAs: 'payNow',
                    params: {
                        'projectSlug': '',
                        'userSlug': ''
                    }
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        }).state('root.thankyou', {
            url: 'thank-you',
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
                    templateUrl: 'app/components/payment/thank-you.html',
                    controller: 'PaymentController',
                    controllerAs: 'thankYou'                    
                },
                'footer@root': {
                    templateUrl: 'app/layouts/footer.html'
                }
            }
        });
});