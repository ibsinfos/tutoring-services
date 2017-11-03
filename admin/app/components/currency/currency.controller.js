(function() {
    "use strict";
    angular.module('currencyApp')
        .controller('CurrencyController', CurrencyController);

    CurrencyController.$inject = ['$scope', '$state', '$location', 'currencyService', 'toastr'];

    function CurrencyController($scope, $state, $location, currencyService, toastr) {
        var vm = this;
        vm.init = init;
        vm.getCurrencyList = getCurrencyList;
        vm.changeCurrency = changeCurrency;
        vm.currencyForm = {};

        /* runs function on module load */
        function init() {
            vm.getCurrencyList();
        }

        /* to get currency list */
        function getCurrencyList() {
            currencyService.getCurrencies().then(function(response) {
                if(response.status == 200) {
                    if(response.data.active) {
                        vm.currencyForm.activeCurrency = response.data.active.id;
                    } else {
                        vm.currencyForm.activeCurrency = "";
                    }
                    vm.currencyList = response.data.currencies;
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            }); 
        }//END getCurrencyList()

        /* to update active currency  */
        function changeCurrency() {
            currencyService.changeCurrency(vm.currencyForm).then(function(response) {
                if(response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            }); 
        }//END changeCurrency()
        
        vm.init();
    }

}());
