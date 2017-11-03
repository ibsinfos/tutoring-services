(function () {
    "use strict";
    angular
        .module('freelancerApp')
        .service('freelancerService', freelancerService);

    freelancerService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function freelancerService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.getBankDetails = getBankDetails;
        self.updateBankDetails = updateBankDetails;
        self.getUserSkills = getUserSkills;
        self.searchSkills = searchSkills;
        self.getSkillsByCategoryId = getSkillsByCategoryId;
        self.updateUserSkills = updateUserSkills;
        self.getBudgets = getBudgets;
        self.getUrgency = getUrgency;
        self.getPercentage = getPercentage;
        self.searchProjects = searchProjects;

        /* to get bank details */
        function getBankDetails() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-bank-details';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
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
        } //END getBankDetails();


        /* to update bank details */
        function updateBankDetails(bankInfo) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-update-bank-details';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("bank_name", bankInfo.bank_name);
                    formData.append("bank_code", bankInfo.bank_code);
                    formData.append("bank_account_number", bankInfo.bank_account_number);
                    formData.append("bank_iban", bankInfo.bank_iban);
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
        } //END getBankDetails();


        /* to get user skills */
        function getUserSkills() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-user-skills';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
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
        } //END getUserSkills();

        /* to get search skills */
        function searchSkills(name) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-search-skills?name=' + name;
            $http({
                method: 'GET',
                url: URL
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END searchSkills();

        /* get all skills from category_id */
        function getSkillsByCategoryId(category_id) {
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
        }; //END getSkillsByCategoryId();        

        /* to update user skills */
        function updateUserSkills(skills) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-update-user-skills';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("skills", JSON.stringify(skills));
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
        } //END updateUserSkills();

        /* to get budgets */
        function getBudgets(type) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-budget-range?type='+type;
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getBudgets();

        /* to get urgency */
        function getUrgency() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-urgency';
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getUrgency();

        /* to get default percentage */
        function getPercentage() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-percentage';
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getPercentage();

        /* to search projects */
        function searchProjects(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-search-project';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("category", obj.category);
                    formData.append("budget_type", obj.budgetType);
                    formData.append("budget", obj.budget);
                    formData.append("urgency", obj.urgency);
                    formData.append("percentage", obj.percentage);
                    formData.append("skill_count", obj.skillsCount);
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
        } //END searchProjects();

        return self;

    }; //END freelancerService()
}());