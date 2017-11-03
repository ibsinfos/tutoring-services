(function () {
    "use strict";
    angular
        .module('paymentApp')
        .service('paymentService', paymentService);

    paymentService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function paymentService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.checkProjectAndUserSlug = checkProjectAndUserSlug;
        self.paymentProcess = paymentProcess;
        self.paymentDone = paymentDone;

        function checkProjectAndUserSlug(projectSlug, userSlug) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-check-product-user-slugs';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("project_slug", projectSlug);
                    formData.append("user_slug", userSlug);
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
        }

        function paymentProcess(paymentDetails) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-payment-process';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());

                    angular.forEach(paymentDetails, function (val, key) {
                        formData.append(key, val);
                    });

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
        }

        function paymentDone(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-payment-done';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("id", obj.id);
                    formData.append("project_id", obj.project_id);
                    formData.append("freelancer_id", obj.freelancer_id);
                    formData.append("intent", obj.intent);
                    formData.append("payer_id", obj.payer_id);
                    formData.append("payment_id", obj.payment_id);
                    formData.append("payment_token", obj.payment_token);
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
        }

        return self;

    }; //END paymentService()
}());