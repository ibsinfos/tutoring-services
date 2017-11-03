(function () {
    "use strict";
    angular
        .module('sharedApp')
        .service('sharedService', sharedService)
        .factory('sharedSocket', sharedSocket);

    sharedService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function sharedService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.updateUserDetails = updateUserDetails;
        self.updateUserPhoto = updateUserPhoto;
        self.changePassword = changePassword;

        /* to update user profile */
        function updateUserDetails(userInfo) {
            console.log(userInfo);
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-update-user-details';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("firstname", userInfo.firstname);
                    formData.append("lastname", userInfo.lastname);
                    formData.append("headline", userInfo.headline);
                    formData.append("bio", userInfo.bio);
                    formData.append("hourly_rate", userInfo.hourly_rate);                    
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
        } //END updateUserDetails();

        /* to update user profile photo */
        function updateUserPhoto(photo) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-update-user-photo';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("photo", photo);
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
        } //END updateUserPhoto();      

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
                    formData.append("token", authServices.getAuthToken());
                    formData.append("oldpassword", obj.oldpassword);
                    formData.append("password", obj.newpassword);
                    formData.append("cpassword", obj.confirmpassword);
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
        } //END changePassword();

        return self;

    }; //END sharedService()

    sharedSocket.$inject = ['$rootScope'];

    function sharedSocket($rootScope) {
        var socket = io.connect('http://localhost:7778');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }; //END sharedSocket()

}());