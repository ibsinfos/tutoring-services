(function () {
    angular.module('budgetApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'toastr', 'angularUtils.directives.dirPagination'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var budgetPath = 'app/components/budgets/';
        $stateProvider
            .state('administrator.budget', {
                url: '/budgets',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/index.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })
            .state('administrator.budget.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/create.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })
            .state('administrator.budget.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/create.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());