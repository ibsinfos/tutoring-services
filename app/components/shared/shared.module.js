var sharedApp = angular.module('sharedApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'toastr',
    'angularValidator',
    'jkAngularRatingStars'
]);

sharedApp.component("userHeader", {
    templateUrl: 'app/components/shared/user-header.html',
    controller: 'SharedController',
    controllerAs: 'shared'
});

sharedApp.component("userEditProfile", {
    templateUrl: 'app/components/shared/user-edit-profile.html',
    controller: 'SharedController',
    controllerAs: 'shared'
});

sharedApp.component("userArea", {
    templateUrl: 'app/components/shared/user-area.html',
    controller: 'SharedController',
    controllerAs: 'shared'
});