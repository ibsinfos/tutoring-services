"use strict";

angular
    .module('authApp')
    .service('authServices', authServices);

authServices.$inject = ['$q', '$http', '$location', '$rootScope', 'APPCONFIG', '$state'];

var someValue = '';

function authServices($q, $http, $location, $rootScope, APPCONFIG, $state) {

    return {
        checkLogin: checkLogin,
        checkForgotPassword: checkForgotPassword,
        checkValidUser: checkValidUser,
        setAuthToken: setAuthToken,
        getAuthToken: getAuthToken,
        //checkUserAuth: checkUserAuth,
        saveUserInfo: saveUserInfo,
        //userPermission: userPermission,
        logout: logout
    }

    //to check if user is login and set user details in rootscope
    function checkLogin(obj) {
        var deferred = $q.defer();
        var URL = APPCONFIG.APIURL + 'login';
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("email", obj.email);
                formData.append("password", obj.password);
                formData.append("type", "admin");
                return formData;
            },
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            $rootScope.isLogin = true;
            //$rootScope.$broadcast('auth:login:success', response.data);
            deferred.resolve(response);
        }, function (response) {
            $rootScope.isLogin = false;
            $rootScope.$broadcast('auth:login:required');
            deferred.reject(response);
        });
        return deferred.promise;
    } //END checkLogin();


    function checkValidUser(isAuth) {
        var URL = APPCONFIG.APIURL + 'validate-user';
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("token", getAuthToken());
                formData.append("type", 'admin');
                return formData;
            },
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            $rootScope.isLogin = true;
            saveUserInfo(response.data);
            if (isAuth === false)
                $rootScope.$broadcast('auth:login:success');

            deferred.resolve();
        }).catch(function (response) {
            $rootScope.isLogin = false;

            if (isAuth === false) {
                deferred.resolve();
            } else {
                $rootScope.$broadcast('auth:login:required');
                deferred.resolve();
            }
        });
        return deferred.promise;
    } //END checkValidUser();

    function checkForgotPassword(email) {
        var URL = APPCONFIG.APIURL + 'forgot-password';
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("email", email);
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
    } //END checkForgotPassword();

    function setAuthToken(userInfo) {
        localStorage.setItem('token', userInfo.headers('Access-token'));
    } //END setAuthToken();

    function getAuthToken() {
        if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null)
            return localStorage.getItem('token');
        else
            return null;
    } //END getAuthToken();

    function saveUserInfo(data) {
        var user = {};
        if (data.status == 1) {
            user = data.user_detail;
            $rootScope.user = user;
            $rootScope.baseUrl = APPCONFIG.APIURL;
        }
        return user;
    } //END saveUserInfo();

    function logout() {
        localStorage.removeItem('token');
    } //END logout()    
};