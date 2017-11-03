(function() {
    "use strict";
    angular.module('skillApp')
        .controller('SkillController', SkillController);

    SkillController.$inject = ['$scope', '$state', '$location', 'skillService', 'toastr', 'SweetAlert', 'APPCONFIG'];

    function SkillController($scope, $state, $location, skillService, toastr, SweetAlert, APPCONFIG) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false; vm.title = 'Add New'; 
        vm.getParentCategories = getParentCategories;
        vm.selectedParentCategory = selectedParentCategory;
        vm.showSubCat = false;
        vm.saveSkill = saveSkill;
        vm.getSkillsList = getSkillsList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalSkills = 0;
        vm.skillsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };

        vm.editSkill = editSkill;
        vm.deleteSkill = deleteSkill;
        vm.changeStatus = changeStatus;
        vm.skillForm = {};
        vm.reset = reset;
        vm.categorySearchAPI = APPCONFIG.APIURL + 'get-parent-categories?name=';
        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if(path[3] == ""){
                $state.go('administrator.skill');
                return false;
            } else {
                editSkill(path[3]);
            }
        }

        /* runs function on module load */
        function init() {}

        /* to format date*/
        function formatDate(date) {
          return moment(date).format("MMMM Do YYYY");
        }//END formatDate()

        /* for sorting skill list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }//END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getSkillsList(newPage, searchInfo);
        }//END changePage()

        /* to get all parent categories */
        function getParentCategories() {
            skillService.getParentCategories().then(function(response) {
                if(response.status == 200) {
                    if(response.data.parent_categories.length > 0) {
                        vm.parentCategories = response.data.parent_categories;
                    } else {
                        vm.parentCategories = ""
                    }
                } else {
                    vm.parentCategories = "";
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getParentCategories()

        /* set parent category id after selecteing from autocomplete */
        function selectedParentCategory(parent) {
            if(parent) {
                if (typeof parent.originalObject === 'object') {
                    vm.skillForm.parentCategoryId = parent.originalObject.id;
                    //getSubCategories(vm.skillForm.parentCategoryId);
                } else{
                    vm.skillForm.parentCategoryId = '';
                }
            } else {
                vm.skillForm.parentCategoryId = '';
            }
        }//END selectedParentCategory()

        // function getSubCategories(parentCategoryId) {
        //     skillService.getSubCategories(parentCategoryId).then(function(response) {
        //         if(response.status == 200) {
        //             if(response.data.sub_categories && response.data.sub_categories.length > 0) {
        //                 vm.subCategories = response.data.sub_categories;
        //                 vm.showSubCat = true;
        //             } else {
        //                 vm.skillForm.subCategoryId = 0;
        //                 vm.showSubCat = false;
        //             }
        //         }
        //     },function (error) {
        //         vm.showSubCat = false;
        //         toastr.error(error.data.error, 'Error');
        //     });
        // }

        /* to save skill after add and edit  */
        function saveSkill() {
            if(vm.skillForm.parentCategoryId != undefined && vm.skillForm.parentCategoryId != '') {
                skillService.saveSkill(vm.skillForm).then(function(response) {
                    if(response.status == 200) {
                        toastr.success(response.data.message, 'Success');
                        $state.go('administrator.skill');
                    } else {
                        toastr.error(response.data.error, 'Error');
                    }
                },function (error) {
                    toastr.error(error.data.error, 'Error');
                });
            } else {
                toastr.error('Category does not exist', 'Error');
            }
        }//END saveSkill()

        /* to get skills list */
        function getSkillsList(newPage, obj) {
            skillService.getSkills(newPage, obj).then(function(response) {
                if (response.status == 200) {
                    if(response.data.skills && response.data.skills.length > 0) {
                        vm.totalSkills = response.headers('total_skills');
                        vm.skillList = response.data.skills;
                    } else {
                        vm.totalSkills = 0;
                        vm.skillList = "";
                    }
                } 
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getSkillsList

        //to show skill details in form
        function editSkill(skillId) {
                vm.editFlag = true;
                vm.title = 'Edit';
                getSkillsInfo(skillId);
        }//END editSkill()

        /* to get skill information */
        function getSkillsInfo(skillId) {
            skillService.getSkillById(skillId).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.skillForm.parentCategoryId = response.data.skill.parent_id;
                        vm.skillForm.parentCategoryName = response.data.skill.parent_name;
                        //vm.skillForm.subCategoryId = response.data.skill.sub_cat_id;
                        // if(vm.skillForm.subCategoryId != 0) {
                        //     vm.showSubCat = true;
                        //     getSubCategories(vm.skillForm.parentCategoryId);
                        // }
                        vm.skillForm.skillId = response.data.skill.id;
                        vm.skillForm.name = response.data.skill.name;
                    }
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getSkillsInfo();

        /** to delete a skill **/
        function deleteSkill(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this skill?",
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
                    skillService.deleteSkill(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.skillList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deleteSkill()

        /* to change active/inactive status of skill */ 
        function changeStatus(obj) {
            var data = { skillId: obj.id, status: obj.status };
            skillService.changeStatus(data).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getSkillsList(1,'');
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
            getSkillsList(1,'');
        }//END reset()
        
        vm.init();
    }

}());
