(function() {
    "use strict";
    angular
        .module('currencyApp')
        .service('currencyService', currencyService);

    currencyService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function currencyService($http, APPCONFIG, $q) {

        self.getCurrencies = getCurrencies;
        self.changeCurrency = changeCurrency;
        
        /* to get all currencies */
        function getCurrencies() {
            var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-currencies',
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getCurrencies();

        /* update currency */
        function changeCurrency(obj) {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'currency-update';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("currency_id", obj.activeCurrency);
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
        } //END changeCurrency();

        return self;

    };//END currencyService()
}());
