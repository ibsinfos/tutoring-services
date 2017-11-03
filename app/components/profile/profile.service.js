(function () {
    "use strict";
    angular
        .module('profileApp')
        .service('profileService', profileService);

    profileService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function profileService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.searchFreelancer = searchFreelancer;

        /* search freelancer */
        function searchFreelancer(slug) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-profile-freelancer';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("slug", slug);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }; //END searchFreelancer();

        return self;

    }; //END profileService()
}());