(function () {
    angular.module('projectApp', ['toastr', 'angularUtils.directives.dirPagination', 'angularjs-datetime-picker','ui.bootstrap'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var projectPath = 'app/components/projects/';
        $stateProvider
            .state('administrator.projects', {
                url: '/projects',
                views: {
                    'content@administrator': {
                        templateUrl: projectPath + 'views/index.html',
                        controller: 'ProjectController',
                        controllerAs: 'project'
                    }
                }
            }).state('administrator.projects.view', {
                url: '/view/:id',
                views: {
                    'content@administrator': {
                        templateUrl: projectPath + 'views/view.html',
                        controller: 'ProjectController',
                        controllerAs: 'project'
                    }
                }
            });
        //$locationProvider.html5Mode(true);
    }

}());