"use strict";

angular.module('authApp').service('authServices', authServices);

authServices.$inject = ['$q', '$http', '$location', '$rootScope', 'APPCONFIG', '$state'];

var someValue = '';

function authServices($q, $http, $location, $rootScope, APPCONFIG, $state) {

    return {
        signUpFreelancer: signUpFreelancer,
        signUpEmployer: signUpEmployer,
        checkLogin: checkLogin,
        checkEmailExists: checkEmailExists,
        checkForgotPassword: checkForgotPassword,
        checkValidUser: checkValidUser,
        setAuthToken: setAuthToken,
        getAuthToken: getAuthToken,
        //checkUserAuth: checkUserAuth,
        saveUserInfo: saveUserInfo,
        userPermission: userPermission,
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
                formData.append("type", "user");
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

    function checkEmailExists(email) {
        var URL = APPCONFIG.APIURL + 'email-exists';
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
        }).catch(function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    } //END checkEmailExists();    

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
                formData.append("type", 'user');
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

    function userPermission() {
        return Array("/dashboard", "/", "/profile", "/auth");
    } //END userPermission();

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
        }
        return user;
    } //END saveUserInfo();

    function logout() {
        localStorage.removeItem('token');
    } //END logout()    

    function signUpFreelancer(obj) {
        var deferred = $q.defer();
        var URL = APPCONFIG.APIURL + 'freelancer-signup';
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("email", obj.email);
                formData.append("password", obj.password);
                formData.append("cpassword", obj.confirmpassword);
                formData.append("firstname", obj.fname);
                formData.append("lastname", obj.lname);
                formData.append("phone", obj.phone);
                formData.append("country", obj.country);
                formData.append("skills", JSON.stringify(obj.skills));
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
    } //END signUpFreelancer()    

    function signUpEmployer(obj) {
        var deferred = $q.defer();
        var URL = APPCONFIG.APIURL + 'employer-signup';
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("projectTitle", obj.projectTitle);
                formData.append("projectDescription", obj.projectDescription);
                formData.append("projectSpecification", obj.projectSpecification);

                formData.append("projectCategory", obj.projectCategory);
                formData.append("projectUrgency", obj.projectUrgency);
                formData.append("projectBudgetType", obj.projectBudgetType);
                formData.append("projectBudget", obj.projectBudget);
                formData.append("projectSkills", JSON.stringify(obj.skills));

                formData.append("firstname", obj.fname);
                formData.append("lastname", obj.lname);
                formData.append("email", obj.email);
                formData.append("password", obj.password);
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
    } //END signUpEmployer()    
}
;