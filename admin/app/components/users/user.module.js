var userApp = angular.module('userApp', ['ui.router', 'ui.router.compat']);
userApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
            .state('administrator.user', {
                url: '/users',
                views: {
                    'content@administrator': {
                        templateUrl: 'app/components/administrator/users/views/index.html'
                    }
                }
            })
            .state('administrator.user.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: 'app/components/administrator/users/views/create.html'
                    }
                }
            })
            .state('administrator.user.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: 'app/components/administrator/users/views/edit.html'
                    }
                }
            })
            .state('administrator.user.view', {
                url: '/:id',
                views: {
                    'content@administrator': {
                        templateUrl: 'app/components/administrator/users/views/view.html'
                    }
                }
            })
});
