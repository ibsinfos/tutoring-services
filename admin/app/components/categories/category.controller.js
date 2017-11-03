(function() {
    "use strict";
    angular.module('categoryApp')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$scope', '$state', '$location', 'categoryService', 'toastr', 'SweetAlert', '$uibModal'];

    function CategoryController($scope, $state, $location, categoryService, toastr, SweetAlert, $uibModal) {
        var vm = this;
        vm.init = init;
        vm.editFlag = false, vm.title = 'Add New';
        vm.saveCategory = saveCategory;
        vm.getParentCategories = getParentCategories;
        vm.selectedParentCategory = selectedParentCategory;
        vm.getCategoriesList = getCategoriesList;
        vm.formatDate = formatDate;

        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalCategories = 0;
        vm.categoriesPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };

        vm.editCategory = editCategory;
        vm.deleteCategory = deleteCategory;
        vm.changeStatus = changeStatus;
        vm.categoryForm = {};
        vm.reset = reset;
        vm.openSortCategoryModal = openSortCategoryModal;
        vm.saveCategoryOrder = saveCategoryOrder;

        vm.sortableOptions = {
            stop: function(e, ui) {  
                vm.sortedCategories = vm.parentCategories.map(function(i){
                    return i;
                });
            }
        };

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "edit") {
            if(path[3] == ""){
                $state.go('administrator.categories');
                return false;
            } else {
                editCategory(path[3]);
            }
        }

        /* runs function on module load */
        function init() {
            vm.getParentCategories();
        }

        /* to format date*/
        function formatDate(date) {
          return moment(date).format("MMMM Do YYYY");
        }//END formatDate()

        /* for sorting category list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        }//END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getCategoriesList(newPage, searchInfo);
        }//END changePage()

        /* to save category after add and edit  */
        function saveCategory() {
            vm.categoryForm.parentId = (vm.categoryForm.parentId == undefined || vm.categoryForm.parentId == '') ? 0 : vm.categoryForm.parentId;
            categoryService.saveCategory(vm.categoryForm).then(function(response) {
                if(response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                    $state.go('administrator.category');
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            },function (error) {
                toastr.error('Internal server error', 'Error');
            }); 
        }//END saveCategory()

        /* to get all parent categories */
        function getParentCategories() {
            categoryService.getParentCategories().then(function(response) {
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
                    vm.categoryForm.parentId = parent.originalObject.id;
                } else{
                    vm.categoryForm.parentId = '';
                }
            } else {
                vm.categoryForm.parentId = '';
            }
        }//selectedParentCategory()

        /* to get category list */
        function getCategoriesList(newPage, obj) {
            categoryService.getCategories(newPage, obj).then(function(response) {
                if (response.status == 200) {
                    if(response.data.categories && response.data.categories.length > 0) {
                        vm.totalCategories = response.headers('total_categories');
                        vm.categoryList = response.data.categories;
                    } else {
                        vm.totalCategories = 0;
                        vm.categoryList = "";
                    }
                } 
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getCategoriesList

        //to show category details in form
        function editCategory(catId) {
                vm.editFlag = true;
                vm.title = 'Edit';
                getCategoryById(catId);
        }//END editCategory()

        /* to get category information */
        function getCategoryById(catId) {
            categoryService.getCategoryById(catId).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.categoryForm.categoryId = response.data.category.id;
                        vm.categoryForm.name = response.data.category.name;
                        vm.categoryForm.parentId = response.data.category.parent_id;
                        vm.categoryForm.description = response.data.category.description;
                        vm.categoryForm.parentName = response.data.category.parent_name;
                    }
                }
            },function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getCategoryInfo();

        /** to delete a category **/
        function deleteCategory(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this category?",
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
                    categoryService.deleteCategory(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.categoryList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deleteCategory()

        /* to change active/inactive status of category */ 
        function changeStatus(obj) {
            var data = { categoryId: obj.id, status: obj.status };
            categoryService.changeStatus(data).then(function(response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        SweetAlert.swal("Success!", response.data.message, "success");
                        getCategoriesList(1,'');
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
            getCategoriesList(1,'');
        }//END reset()

        /* open modal box to reorder categories */
        function openSortCategoryModal() {
            $scope.categorySortModal = $uibModal.open({
                animation: true,
                backdrop: false,
                windowClass: 'overlay',
                templateUrl: 'app/components/categories/views/sort-category-popup.html',
                scope: $scope
            });
        }//END openSortCategoryModal()

        function saveCategoryOrder() {
            var arr = [];
            angular.forEach(vm.sortedCategories, function(value, key) {
                arr.push({
                    id:value.id,
                    name:value.name,
                    category_index:key
                });
            });
            categoryService.saveCategoryOrder(arr).then(function(response) {
                if(response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                    $scope.categorySortModal.close();
                } else {
                    toastr.error(response.data.error, 'Error');
                }
            },function (error) {
                toastr.error(response.data.error, 'Error');
            });
        }

        vm.init();
    }

}());
