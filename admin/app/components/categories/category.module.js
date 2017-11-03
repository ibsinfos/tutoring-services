(function () {
    angular.module('categoryApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oitozero.ngSweetAlert', 'ui.sortable', 'ui.bootstrap'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {

        var categoryPath = 'app/components/categories/';
        $stateProvider
            .state('administrator.category', {
                url: '/categories',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/index.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/create.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/create.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.view', {
                url: '/view/:id',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/view.html'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());