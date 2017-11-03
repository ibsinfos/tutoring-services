(function() {
    "use strict";
    angular
        .module('budgetApp')
        .service('budgetService', budgetService);

    budgetService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function budgetService($http, APPCONFIG, $q) {
        
        self.saveBudget = saveBudget;
        self.getActiveCurrency = getActiveCurrency;
        self.getBudgets = getBudgets;
        self.getBudgetById = getBudgetById;
        self.deleteBudget = deleteBudget;
        self.changeStatus = changeStatus;
        
        /* save budget */
        function saveBudget(obj) {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'budget-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    obj.currencyId = (obj.currencyId === undefined) ? '' : obj.currencyId;
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.rangeFrom = (obj.rangeFrom === undefined) ? '' : obj.rangeFrom;
                    obj.rangeTo = (obj.rangeTo === undefined) ? '' : obj.rangeTo;
                    if(obj.budgetId != undefined && obj.budgetId != '') {
                    	formData.append("budget_id", obj.budgetId);
                    }
                    formData.append("currency_id", obj.currencyId);
                    formData.append("name", obj.name);
                    formData.append("range_from", obj.rangeFrom);
                    formData.append("range_to", obj.rangeTo);
                    formData.append("type", obj.type);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function(response) {
            	deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END saveBudget();

        /* to get active currency */
        function getActiveCurrency() {
            var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-active-currency',
                method: "GET",
                //headers: { 'Content-Type': { 'X-Requested-With' :'XMLHttpRequest'} }
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getActiveCurrency();

        /* to get all budgets */
        function getBudgets(pageNum, obj) {
        	var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;

                if (obj.type != undefined && obj.type != "")
                    where += '&type=' + obj.type;
			}
            
            $http({
                url: APPCONFIG.APIURL + 'get-budgets?' + where,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getBudgets();

        /* to get budget */
        function getBudgetById(id) {
        	var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-budget-details/' + id,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getBudgetById();

        /* to delete a budget from database */
        function deleteBudget(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-budget';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("budget_id", id);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END deleteBudget();

        /* to change active/inactive status of budget */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-budget-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("budget_id", obj.budgetId);
                    formData.append("status", obj.status);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END changeStatus();

        return self;

    };//END budgetService()
}());
