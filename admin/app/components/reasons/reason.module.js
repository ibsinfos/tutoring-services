(function () {
    angular.module('reasonApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oi.select'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var path = 'app/components/reasons/';
        $stateProvider
            .state('administrator.reason', {
                url: '/reasons',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/index.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
            .state('administrator.reason.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/create.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
            .state('administrator.reason.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/create.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
    }

}());