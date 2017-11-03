(function () {
    "use strict";
    angular.module('subjectApp')
        .controller('SubjectController', SubjectController);

    SubjectController.$inject = ['$scope', '$state', '$location', 'subjectService', 'toastr', 'SweetAlert', 'APPCONFIG'];

    function SubjectController($scope, $state, $location, subjectService, toastr, SweetAlert, APPCONFIG) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false; vm.title = 'Add New';
        vm.getParentCategories = getParentCategories;
        vm.selectedParentCategory = selectedParentCategory;
        vm.showSubCat = false;
        vm.saveSubject = saveSubject;
        vm.getSubjectsList = getSubjectsList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalSubjects = 0;
        vm.subjectsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };

        vm.editSubject = editSubject;
        vm.deleteSubject = deleteSubject;
        vm.changeStatus = changeStatus;
        vm.subjectForm = {};
        vm.reset = reset;
        vm.categorySearchAPI = APPCONFIG.APIURL + 'get-parent-categories?name=';
        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if (path[3] == "") {
                $state.go('administrator.subject');
                return false;
            } else {
                editSubject(path[3]);
            }
        }

        /* runs function on module load */
        function init() { }

        /* to format date*/
        function formatDate(date) {
            return moment(date).format("MMMM Do YYYY");
        }//END formatDate()

        /* for sorting subject list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }//END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getSubjectsList(newPage, searchInfo);
        }//END changePage()

        /* to get all parent categories */
        function getParentCategories() {
            subjectService.getParentCategories().then(function (response) {
                if (response.status == 200) {
                    if (response.data.parent_categories.length > 0) {
                        vm.parentCategories = response.data.parent_categories;
                    } else {
                        vm.parentCategories = ""
                    }
                } else {
                    vm.parentCategories = "";
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getParentCategories()

        /* set parent category id after selecteing from autocomplete */
        function selectedParentCategory(parent) {
            if (parent) {
                if (typeof parent.originalObject === 'object') {
                    vm.subjectForm.parentCategoryId = parent.originalObject.id;
                    //getSubCategories(vm.subjectForm.parentCategoryId);
                } else {
                    vm.subjectForm.parentCategoryId = '';
                }
            } else {
                vm.subjectForm.parentCategoryId = '';
            }
        }//END selectedParentCategory()
       
        /* to save subject after add and edit  */
        function saveSubject() {
            if (vm.subjectForm.parentCategoryId != undefined && vm.subjectForm.parentCategoryId != '') {
                subjectService.saveSubject(vm.subjectForm).then(function (response) {
                    if (response.status == 200) {
                        toastr.success(response.data.message, 'Success');
                        $state.go('administrator.subject');
                    } else {
                        toastr.error(response.data.error, 'Error');
                    }
                }, function (error) {
                    toastr.error(error.data.error, 'Error');
                });
            } else {
                toastr.error('Category does not exist', 'Error');
            }
        }//END saveSubject()

        /* to get subjects list */
        function getSubjectsList(newPage, obj) {
            subjectService.getSubjects(newPage, obj).then(function (response) {
                if (response.status == 200) {
                    if (response.data.subjects && response.data.subjects.length > 0) {
                        vm.totalSubjects = response.headers('total_subjects');
                        vm.subjectList = response.data.subjects;
                    } else {
                        vm.totalSubjects = 0;
                        vm.subjectList = "";
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getSubjectsList

        //to show subject details in form
        function editSubject(subjectId) {
            vm.editFlag = true;
            vm.title = 'Edit';
            getSubjectsInfo(subjectId);
        }//END editSubject()

        /* to get subject information */
        function getSubjectsInfo(subjectId) {
            subjectService.getSubjectById(subjectId).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.subjectForm.parentCategoryId = response.data.subject.parent_id;
                        vm.subjectForm.parentCategoryName = response.data.subject.parent_name;
                        //vm.subjectForm.subCategoryId = response.data.subject.sub_cat_id;
                        // if(vm.subjectForm.subCategoryId != 0) {
                        //     vm.showSubCat = true;
                        //     getSubCategories(vm.subjectForm.parentCategoryId);
                        // }
                        vm.subjectForm.subjectId = response.data.subject.id;
                        vm.subjectForm.name = response.data.subject.name;
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getSubjectsInfo();

        /** to delete a subject **/
        function deleteSubject(id, index) {
            SweetAlert.swal({
                title: "Are you sure you want to delete this subject?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: true,
                html: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        subjectService.deleteSubject(id).then(function (response) {
                            if (response.data.status == 1) {
                                SweetAlert.swal("Deleted!", response.data.message, "success");
                                vm.subjectList.splice(index, 1);
                            }
                        }, function (error) {
                            toastr.error(error.data.error, 'Error');
                        });
                    }
                });
        }//END deleteSubject()

        /* to change active/inactive status of subject */
        function changeStatus(obj) {
            var data = { subjectId: obj.id, status: obj.status };
            subjectService.changeStatus(data).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getSubjectsList(1, '');
                        return true;
                    }
                } else {
                    toastr.error(response.data.error, 'Error');
                    return false;
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END changeStatus()

        /* to reset all search parameters in listing */
        function reset() {
            vm.search = [];
            getSubjectsList(1, '');
        }//END reset()

        vm.init();
    }

}());
