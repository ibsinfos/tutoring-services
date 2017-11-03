(function() {
    "use strict";
    angular.module('budgetApp')
        .controller('BudgetController', BudgetController);

    BudgetController.$inject = ['$scope', '$state', '$location', 'budgetService', 'toastr', 'SweetAlert'];

    function BudgetController($scope, $state, $location, budgetService, toastr, SweetAlert) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false, vm.title = 'Add New';
        vm.validateRange = validateRange;
        vm.getActiveCurrency = getActiveCurrency;
        vm.saveBudget = saveBudget;
        vm.getBudgetsList = getBudgetsList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalBudgets = 0;
        vm.budgetsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };

        vm.editBudget = editBudget;
        vm.deleteBudget = deleteBudget;
        vm.changeStatus = changeStatus;
        vm.budgetForm = {};
        vm.budgetForm.type = '1';
        vm.reset = reset;

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if(path[3] == ""){
                $state.go('administrator.budget');
                return false;
            } else {
                editBudget(path[3]);
            }
        }

        /* runs function on module load */
        function init() {
            vm.getActiveCurrency();
        }

        /* to format date*/
        function formatDate(date) {
          return moment(date).format("MMMM Do YYYY");
        }//END formatDate()

        /* for sorting budget list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }//END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getBudgetsList(newPage, searchInfo);
        }//END changePage()

        /* to accept range upto 2 decimal places*/
        function validateRange(range) {
            var regex = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
            if(!regex.test(range)) {
                return "Range should be upto 2 decimal places";
            }
            return true;
        }//END validateRange

        /* to get active currency */
        function getActiveCurrency() {
            budgetService.getActiveCurrency().then(function(response) {
                if(response.status == 200) {
                    vm.budgetForm.currencyName = response.data.activeCurrency.name;
                    vm.budgetForm.currencyId = response.data.activeCurrency.id;
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            }); 
        }//END getActiveCurrency()

        /* to save budget after add and edit  */
        function saveBudget() {
            budgetService.saveBudget(vm.budgetForm).then(function(response) {
                if(response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                    $state.go('administrator.budget');
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            }); 
        }//END saveBudget()

        /* to get budgets list */
        function getBudgetsList(newPage, obj) {
            budgetService.getBudgets(newPage, obj).then(function(response) {
                if (response.status == 200) {
                    if(response.data.budgets && response.data.budgets.length > 0) {
                        vm.totalBudgets = response.headers('total_budgets');
                        vm.budgetList = response.data.budgets;
                    } else {
                        vm.totalBudgets = 0;
                        vm.budgetList = "";
                    }
                } 
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getBudgetsList

        //to show budget details in form
        function editBudget(budgetId) {
                vm.editFlag = true;
                vm.title = 'Edit';
                getBudgetInfo(budgetId);
        }//END editBudget()

        /* to get budget information */
        function getBudgetInfo(budgetId) {
            budgetService.getBudgetById(budgetId).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.budgetForm.budgetId = response.data.budget.id;
                        vm.budgetForm.name = response.data.budget.name;
                        vm.budgetForm.rangeFrom = response.data.budget.range_from * 1;
                        vm.budgetForm.rangeTo = response.data.budget.range_to  * 1;
                        vm.budgetForm.type = response.data.budget.type;
                    }
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getBudgetInfo();

        /** to delete a budget **/
        function deleteBudget(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this budget?",
               text: "",
               type: "warning",
               showCancelButton: true,
               confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
               cancelButtonText: "No",
               closeOnConfirm: false,
               closeOnCancel: true,
               html: true
            }, 
            function(isConfirm){ 
                if (isConfirm) {
                    budgetService.deleteBudget(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.budgetList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deleteBudget()

        /* to change active/inactive status of budget */ 
        function changeStatus(obj) {
            var data = { budgetId: obj.id, status: obj.status };
            budgetService.changeStatus(data).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getBudgetsList(1,'');
                        return true;
                    }
                } else {
                    toastr.error(response.data.error, 'Error');
                    return false;
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END changeStatus()

        /* to reset all search parameters in listing */
        function reset() {
            vm.search = [];
            getBudgetsList(1,'');
        }//END reset()
        
        vm.init();
    }

}());
