(function () {
    angular.module('packageApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oi.select'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var packagePath = 'app/components/packages/';
        $stateProvider
            .state('administrator.package', {
                url: '/packages',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/index.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })
            .state('administrator.package.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/create.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })
            .state('administrator.package.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/create.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());