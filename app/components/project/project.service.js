(function () {
    "use strict";
    angular
        .module('projectApp')
        .service('projectService', projectService);

    projectService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function projectService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.singleProject = singleProject;
        self.reportAbuse = reportAbuse;
        self.getAllReasons = getAllReasons;
        self.createBid = createBid;

        /* get project */
        function singleProject(slug) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-single-project';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("project_slug", slug);
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
        }; //END singleProject();

        function reportAbuse(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-report-abuse';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("project_id", obj.project_id);
                    formData.append("reason", obj.reason);
                    formData.append("comments", obj.comments);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        } //END reportAbuse()  

        /* to get all reasons */
        function getAllReasons() {
            var deferred = $q.defer();

            $http({
                url: APPCONFIG.APIURL + 'front-get-all-reasons',
                method: "GET",
            })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        } //END getAllReasons();

        function createBid(bidInfo) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-bid-on-project';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("project_id", bidInfo.project_id);
                    formData.append("bidAmount", bidInfo.bidAmount);
                    formData.append("deliveryDays", bidInfo.deliveryDays);
                    formData.append("summary", bidInfo.summary);
                    formData.append("skillsSummary", bidInfo.skillsSummary);
                    formData.append("employerQuestion", bidInfo.employerQuestion);
                    formData.append("amount", JSON.stringify(bidInfo.amount));
                    formData.append("description", JSON.stringify(bidInfo.description));

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
        } //END createBid();

        return self;

    };//END projectService()
}());
