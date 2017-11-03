(function () {
    angular.module('skillApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'angularjs-datetime-picker'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var skillPath = 'app/components/skills/';
        $stateProvider
            .state('administrator.skill', {
                url: '/skills',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/index.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })
            .state('administrator.skill.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/create.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })
            .state('administrator.skill.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/create.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());