(function() {
    'use strict';

    angular
        .module('administratorApp')
        .service('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['$q', '$rootScope'];

    function HttpInterceptor($q, $rootScope) {
        return {
            request: function(config) {
                config.requestTimestamp = new Date().getTime();
                return config;
            },
            response: function(response) {
                console.log(response);
                response.config.responseTimestamp = new Date().getTime();
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                console.log(rejection.status);
                if (rejection.status === 404) {
                    alert("Not found");
                }
                return $q.reject(rejection);
            }
        };
    }
})();