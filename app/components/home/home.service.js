(function () {
    "use strict";
    angular
        .module('homeApp')
        .service('homeService', homeService);

    homeService.$inject = ['$http', 'APPCONFIG', '$q'];

    function homeService($http, APPCONFIG, $q) {
        return {
            updateProfile: updateProfile,
            changePassword: changePassword,
            getCategories: getCategories,
            getSkills: getSkills,
            getBudgets: getBudgets,
            getUrgency: getUrgency
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
                    formData.append("phone", obj.phone);
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

        /* get categories */
        function getCategories() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-categories';

            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getCategories();

        /* get skills */
        function getSkills(category_id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-skills';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("category_id", category_id);
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
        }; //END getCategories();

        /* to get budgets */
        function getBudgets(budgetType) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-budget-range?type=' + budgetType;
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }; //END getBudgets();

        /* to get urgency */
        function getUrgency() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-urgency';
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }; //END getUrgency();

    }; //END dashboardService()
}());