/* global angular */
"use strict";

var app = angular.module('tutoringApp', [
    'ui.router',
    'ui.router.compat',
    'angular-loading-bar',
    'administratorApp'
]);

app.constant('APPCONFIG', {
    //'APIURL': 'http://api.ts.dev/',
    'APIURL': 'https://tutoringservices-api-aman-raikwar.c9users.io/api/',
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
});
