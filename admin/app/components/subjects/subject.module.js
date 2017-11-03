(function () {
    angular.module('subjectApp', [
        'ui.router',
        'ui.router.compat',
        'ui.bootstrap',
        'angularValidator',
        'angucomplete-alt',
        'toastr',
        'angularUtils.directives.dirPagination',
        'angularjs-datetime-picker'
    ]).config(config);

    function config($stateProvider, $urlRouterProvider) {
        var subjectPath = 'app/components/subjects/';
        $stateProvider
            .state('administrator.subject', {
                url: '/subjects',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/index.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            })
            .state('administrator.subject.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/create.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            })
            .state('administrator.subject.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/create.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            });

    }

}());