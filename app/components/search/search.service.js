(function () {
    "use strict";
    angular
        .module('searchApp')
        .service('searchService', searchService);

    searchService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function searchService($http, APPCONFIG, $q, authServices) {
        return {
            searchProjects: searchProjects            
        }

        /* search projects */
        function searchProjects(search) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-search-projects';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("category", search.category);
                    formData.append("budgetType", search.budgetType);
                    formData.append("budget", search.budget);
                    formData.append("urgency", search.urgency);
                    formData.append("skillsmatch", search.skillmatch);
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
        }; //END searchProjects();

    }; //END dashboardService()
}());