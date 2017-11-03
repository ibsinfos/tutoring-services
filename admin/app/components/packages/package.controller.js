(function() {
    "use strict";
    angular.module('packageApp')
        .controller('PackageController', PackageController);

    PackageController.$inject = ['$scope', '$state', '$location', 'packageService', 'toastr', 'SweetAlert'];

    function PackageController($scope, $state, $location, packageService, toastr, SweetAlert) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false; vm.title = 'Add New'; 
        vm.savePackage = savePackage;
        vm.getKeyTags = getKeyTags;
        vm.validateAmount = validateAmount;
        vm.tagsArr = [];
        vm.getPackagesList = getPackagesList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalPackages = 0;
        vm.packagesPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };
        vm.editPackage = editPackage;
        vm.deletePackage = deletePackage;
        vm.changeStatus = changeStatus;
        vm.packageForm = {};
        vm.reset = reset;

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if(path[3] == ""){
                $state.go('administrator.package');
                return false;
            } else {
                editPackage(path[3]);
            }
        }

        /* runs function on module load */
        function init() {}

        /* to format date*/
        function formatDate(date) {
          return moment(date).format("MMMM Do YYYY");
        }//END formatDate()

        /* for sorting package list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }//END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getPackagesList(newPage, searchInfo);
        }//END changePage()

        /* to get all default key tags */
        function getKeyTags() {
            packageService.getKeyTags().then(function(response) {
                if(response.status == 200) {
                    if(response.data.tags.length > 0) {
                        vm.tags = response.data.tags;
                    } else {
                        vm.tags = ""
                    }
                } else {
                    vm.tags = "";
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getKeyTags()

        /* to accept amount upto 2 decimal places*/
        function validateAmount(amount) {
            var regex = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
            if(!regex.test(amount)) {
                return "Amount should be upto 2 decimal places";
            }
            return true;
        }//END validateAmount

        /* to save package after add and edit  */
        function savePackage() {
            if(vm.tagsArr.length > 0) {
                vm.packageForm.tags =  _.map(vm.tagsArr, 'id');
            } else {
                vm.packageForm.tags = '';
            }
            packageService.savePackage(vm.packageForm).then(function(response) {
                if(response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                    $state.go('administrator.package');
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            }); 
        }//END savePackage()

        /* to get packages list */
        function getPackagesList(newPage, obj) {
            packageService.getPackages(newPage, obj).then(function(response) {
                if (response.status == 200) {
                    if(response.data.packages && response.data.packages.length > 0) {
                        vm.totalPackages = response.headers('total_packages');
                        vm.packageList = response.data.packages;
                    } else {
                        vm.totalPackages = 0;
                        vm.packageList = "";
                    }
                } 
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getPackagesList

        //to show package details in form
        function editPackage(packageId) {
                vm.editFlag = true;
                vm.title = 'Edit';
                getPackageInfo(packageId);
        }//END editPackage()

        /* to get package information */
        function getPackageInfo(packageId) {
            packageService.getPackageById(packageId).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.packageForm.name = response.data.package.name;
                        vm.packageForm.amount = response.data.package.amount * 1;
                        vm.packageForm.description = response.data.package.description;
                        vm.packageForm.packageId = response.data.package.id;
                        vm.tagsArr = response.data.package.tags;
                    }
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getPackageInfo();

        /** to delete a package **/
        function deletePackage(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this package?",
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
                    packageService.deletePackage(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.packageList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deletePackage()

        /* to change active/inactive status of package */ 
        function changeStatus(obj) {
            var data = { packageId: obj.id, status: obj.status };
            packageService.changeStatus(data).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getPackagesList(1,'');
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
            getPackagesList(1,'');
        }//END reset()
        
        vm.init();
    }

}());
