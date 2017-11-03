(function () {
    "use strict";
    angular.module('reasonApp')
        .controller('ReasonController', ReasonController);

    ReasonController.$inject = ['$scope', '$state', '$location', 'reasonService', 'toastr', 'SweetAlert'];

    function ReasonController($scope, $state, $location, reasonService, toastr, SweetAlert) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false;
        vm.title = 'Add New';
        vm.saveReason = saveReason;        
        vm.getReasonsList = getReasonsList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalReasons = 0;
        vm.reasonsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };
        vm.editReason = editReason;
        vm.deleteReason = deleteReason;
        vm.changeStatus = changeStatus;
        vm.reasonForm = {};
        vm.reset = reset;

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if (path[3] == "") {
                $state.go('administrator.reason');
                return false;
            } else {
                editReason(path[3]);
            }
        }

        /* runs function on module load */
        function init() {}

        /* to format date*/
        function formatDate(date) {
            return moment(date).format("MMMM Do YYYY");
        } //END formatDate()

        /* for sorting package list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        } //END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getReasonsList(newPage, searchInfo);
        } //END changePage()

        /* to save reason after add and edit  */
        function saveReason() {
            console.log(vm.reasonForm);
            reasonService.saveReason(vm.reasonForm).then(function (response) {
                if (response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                    $state.go('administrator.reason');
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END saveReason()

        /* to get packages list */
        function getReasonsList(newPage, obj) {
            reasonService.getReasons(newPage, obj).then(function (response) {
                if (response.status == 200) {
                    if (response.data.reasons && response.data.reasons.length > 0) {
                        vm.totalReasons = response.headers('total_reasons');
                        vm.reasonsList = response.data.reasons;
                        console.log(vm.reasonsList, response.headers('total_reasons'));
                    } else {
                        vm.totalReasons = 0;
                        vm.reasonsList = "";
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getReasonsList

        //to show reason details in form
        function editReason(reasonId) {
            vm.editFlag = true;
            vm.title = 'Edit';
            getReasonInfo(reasonId);
        } //END editReason()

        /* to get reason information */
        function getReasonInfo(reasonId) {
            reasonService.getReasonById(reasonId).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.reasonForm.name = response.data.reason.name;
                        vm.reasonForm.reasonId = response.data.reason.id;
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getReasonInfo();

        /** to delete a reason **/
        function deleteReason(id, index) {
            SweetAlert.swal({
                    title: "Are you sure you want to delete this reason?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    html: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        reasonService.deleteReason(id).then(function (response) {
                            if (response.data.status == 1) {
                                SweetAlert.swal("Deleted!", response.data.message, "success");
                                vm.reasonsList.splice(index, 1);
                            }
                        }, function (error) {
                            toastr.error(error.data.error, 'Error');
                        });
                    }
                });
        } //END deleteReason()

        /* to change active/inactive status of package */
        function changeStatus(obj) {
            var data = {
                reasonId: obj.id,
                status: obj.status
            };
            reasonService.changeStatus(data).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getReasonsList(1, '');
                        return true;
                    }
                } else {
                    toastr.error(response.data.error, 'Error');
                    return false;
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END changeStatus()

        /* to reset all search parameters in listing */
        function reset() {
            vm.search = [];
            getReasonsList(1, '');
        } //END reset()

        vm.init();
    }

}());