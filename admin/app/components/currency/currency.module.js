(function () {
    angular.module('currencyApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'toastr'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var currencyPath = 'app/components/currency/';
        $stateProvider
            .state('administrator.currency', {
                url: '/currency',
                views: {
                    'content@administrator': {
                        templateUrl: currencyPath + 'views/index.html',
                        controller: 'CurrencyController',
                        controllerAs: 'currency'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());