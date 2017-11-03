var projectApp = angular.module('projectApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator',
    'ngFileUpload'
]);


projectApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root.project', {
            url: 'project/:slug',
            views: {
                'content@root': {
                    templateUrl: 'app/components/project/index.html',
                    controller: 'ProjectController',
                    controllerAs: 'project',
                    params: {
                        'slug': ''                        
                    }
                }
            }
        });
});