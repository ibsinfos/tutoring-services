(function () {
    "use strict";
    angular
        .module('dashboardApp')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'APPCONFIG', '$q'];

    function dashboardService($http, APPCONFIG, $q) {
        return {
            updateProfile: updateProfile,
            changePassword: changePassword,
            getOverview: getOverview
        }

        /* update profile */
        function updateProfile(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'update-profile';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", obj.token);
                    formData.append("firstname", obj.firstname);
                    formData.append("lastname", obj.lastname);
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
        } //END updateProfile();

        /* change password */
        function changePassword(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-password';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", obj.token);
                    formData.append("oldpassword", obj.old_password);
                    formData.append("password", obj.new_password);
                    formData.append("cpassword", obj.confirm_password);
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
        } //END changePassword();

        /* dashboard overview */
        function getOverview(token) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-overview';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", token);
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
        } //END getOverview();


    }; //END dashboardService()
}());