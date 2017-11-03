var authApp = angular.module('authApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator'
]);

authenticateUser1.$inject = ['authServices', '$state']

function authenticateUser1(authServices, $state) {
    return authServices.checkValidUser(false);
} //END authenticateUser()

authApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('auth', {
            url: '/auth',
            views: {
                '': {
                    templateUrl: 'app/layouts/auth/layout.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        })
        .state('auth.login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: 'app/layouts/auth/layout.html'
                },
                'content@auth': {
                    templateUrl: 'app/components/auth/login.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        })
        .state('auth.forgotpassword', {
            url: '/forgot-password',
            views: {
                'content@auth': {
                    templateUrl: 'app/components/auth/forgotpassword.html',
                    controller: 'AuthController',
                    controllerAs: 'auth'
                }
            },
            resolve: {
                auth1: authenticateUser1
            }
        });
});
"use strict";

angular
    .module('authApp')
    .service('authServices', authServices);

authServices.$inject = ['$q', '$http', '$location', '$rootScope', 'APPCONFIG', '$state'];

var someValue = '';

function authServices($q, $http, $location, $rootScope, APPCONFIG, $state) {

    return {
        checkLogin: checkLogin,
        checkForgotPassword: checkForgotPassword,
        checkValidUser: checkValidUser,
        setAuthToken: setAuthToken,
        getAuthToken: getAuthToken,
        //checkUserAuth: checkUserAuth,
        saveUserInfo: saveUserInfo,
        //userPermission: userPermission,
        logout: logout
    }

    //to check if user is login and set user details in rootscope
    function checkLogin(obj) {
        var deferred = $q.defer();
        var URL = APPCONFIG.APIURL + 'login';
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("email", obj.email);
                formData.append("password", obj.password);
                formData.append("type", "admin");
                return formData;
            },
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            $rootScope.isLogin = true;
            //$rootScope.$broadcast('auth:login:success', response.data);
            deferred.resolve(response);
        }, function (response) {
            $rootScope.isLogin = false;
            $rootScope.$broadcast('auth:login:required');
            deferred.reject(response);
        });
        return deferred.promise;
    } //END checkLogin();


    function checkValidUser(isAuth) {
        var URL = APPCONFIG.APIURL + 'validate-user';
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("token", getAuthToken());
                formData.append("type", 'admin');
                return formData;
            },
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            $rootScope.isLogin = true;
            saveUserInfo(response.data);
            if (isAuth === false)
                $rootScope.$broadcast('auth:login:success');

            deferred.resolve();
        }).catch(function (response) {
            $rootScope.isLogin = false;

            if (isAuth === false) {
                deferred.resolve();
            } else {
                $rootScope.$broadcast('auth:login:required');
                deferred.resolve();
            }
        });
        return deferred.promise;
    } //END checkValidUser();

    function checkForgotPassword(email) {
        var URL = APPCONFIG.APIURL + 'forgot-password';
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: URL,
            processData: false,
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("email", email);
                return formData;
            },
            headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    } //END checkForgotPassword();

    function setAuthToken(userInfo) {
        localStorage.setItem('token', userInfo.headers('Access-token'));
    } //END setAuthToken();

    function getAuthToken() {
        if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null)
            return localStorage.getItem('token');
        else
            return null;
    } //END getAuthToken();

    function saveUserInfo(data) {
        var user = {};
        if (data.status == 1) {
            user = data.user_detail;
            $rootScope.user = user;
            $rootScope.baseUrl = APPCONFIG.APIURL;
        }
        return user;
    } //END saveUserInfo();

    function logout() {
        localStorage.removeItem('token');
    } //END logout()    
};
authApp.controller('AuthController', AuthController);

AuthController.$inject = ['$rootScope', '$location', 'authServices', '$state', 'toastr'];

function AuthController($rootScope, $location, authServices, $state, toastr) {
    var vm = this;
    vm.login = login;
    vm.forgotPassword = forgotPassword;
    //vm.logout = logout;

    $rootScope.bodylayout = 'hold-transition login-page';
    $rootScope.htmllayout = 'add-bg';

    vm.user = {
        email: 'aman@dev.com',
        password: '123456'
    };

    function login(loginInfo) {
        authServices.checkLogin(loginInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "User Login");
                authServices.setAuthToken(response); //Set auth token
                $state.go('administrator.dashboard');
            } else {
                toastr.error(response.data.message, "User Login");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "User Login");
        });
    }; //END login()   

    function forgotPassword(userInfo) {
        authServices.checkForgotPassword(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Forgot Password");
            } else {
                toastr.error(response.data.message, "Forgot Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Forgot Password");
        });
    }; //END forgotPassword() 

};
var dashboardApp = angular.module('dashboardApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator',
    'toastr'
]);

dashboardApp.controller('DashboardController', DashboardController);

//AuthController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
function DashboardController($scope, $rootScope, $state, $location, authServices, dashboardService, toastr) {
    console.log('Dashboard Overview');
    var vm = this;
    vm.logoutUser = logoutUser;
    vm.updateProfile = updateProfile;
    vm.changePassword = changePassword;
    vm.passwordValidator = passwordValidator;
    vm.getOverview = getOverview;    

    function passwordValidator(password) {

        if (!password) {
            return;
        }

        if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }

        // if (!password.match(/[A-Z]/)) {
        //     return "Password must have at least one capital letter";
        // }

        // if (!password.match(/[0-9]/)) {
        //     return "Password must have at least one number";
        // }

        return true;
    };

    function updateProfile(userInfo) {
        userInfo.token = $rootScope.user.token;
        dashboardService.updateProfile(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Update Profile");
            } else {
                toastr.error(response.data.message, "Update Profile");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Update Profile");
        });
    }; //END updateProfile()

    function changePassword(changePasswordInfo) {
        changePasswordInfo.token = $rootScope.user.token;
        dashboardService.changePassword(changePasswordInfo).then(function (response) {
            if (response.status == 200 && response.data.status == 1) {
                toastr.success(response.data.message, "Change Password");
                $scope.changePasswordForm.reset();
            } else {
                toastr.error(response.data.message, "Change Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Change Password");
        });
    }; //END changePassword()

    function getOverview() {
        token = $rootScope.user.token;
        dashboardService.getOverview(token).then(function (response) {
            if (response.status == 200) {
                vm.overview =  {
                    category: response.data.category,
                    subject: response.data.subject
                }
            } else {
                toastr.error(response.data.message, "Dashboard Overview");
            }
        // }).catch(function (response) {
        //     toastr.error(response.data.message, "Dashboard Overview");
        });
    }; //END getOverview()


    $scope.user = $rootScope.user;

    function logoutUser() {
        authServices.logout();
        $state.go('auth.login');
    }

};

dashboardApp.directive('showtab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});
(function () {
    "use strict";
    angular
        .module('dashboardApp')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'APPCONFIG', '$q'];

    function dashboardService($http, APPCONFIG, $q) {
        return {
            updateProfile: updateProfile,
            changePassword: changePassword,
            getOverview: getOverview
        }

        /* update profile */
        function updateProfile(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'update-profile';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", obj.token);
                    formData.append("firstname", obj.firstname);
                    formData.append("lastname", obj.lastname);
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
        } //END updateProfile();

        /* change password */
        function changePassword(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-password';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", obj.token);
                    formData.append("oldpassword", obj.old_password);
                    formData.append("password", obj.new_password);
                    formData.append("cpassword", obj.confirm_password);
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
        } //END changePassword();

        /* dashboard overview */
        function getOverview(token) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-overview';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", token);
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
        } //END getOverview();


    }; //END dashboardService()
}());
(function () {
    angular.module('categoryApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oitozero.ngSweetAlert', 'ui.sortable', 'ui.bootstrap'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {

        var categoryPath = 'app/components/categories/';
        $stateProvider
            .state('administrator.category', {
                url: '/categories',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/index.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/create.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/create.html',
                        controller: 'CategoryController',
                        controllerAs: 'category'
                    }
                }
            })
            .state('administrator.category.view', {
                url: '/view/:id',
                views: {
                    'content@administrator': {
                        templateUrl: categoryPath + 'views/view.html'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());
(function() {
    "use strict";
    angular
        .module('categoryApp')
        .service('categoryService', categoryService);

    categoryService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function categoryService($http, APPCONFIG, $q) {
        var self = this;
        
        self.saveCategory = saveCategory,
        self.getParentCategories = getParentCategories,
        self.getCategories = getCategories,
        self.getCategoryById = getCategoryById,
        self.deleteCategory = deleteCategory,
        self.changeStatus = changeStatus,
        self.saveCategoryOrder = saveCategoryOrder;

        /* save category */
        function saveCategory(obj) {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'category-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.description = (obj.description === undefined) ? '' : obj.description;
                    if(obj.categoryId != undefined && obj.categoryId != '') {
                    	formData.append("category_id", obj.categoryId);
                    }
                    formData.append("parent_id", 0);
                    formData.append("name", obj.name);
                    formData.append("description", obj.description);
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
        } //END saveCategory();

        /* to get parent categories */
        function getParentCategories() {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-parent-categories';
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
            	deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getParentCategories();

        /* to get all categories */
        function getCategories(pageNum, obj) {
        	var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.parent_name != undefined && obj.parent_name != "")
                    where += '&parent_name=' + obj.parent_name;

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;
			}
            
            $http({
                url: APPCONFIG.APIURL + 'get-categories?' + where,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }//END getCategories();

        /* to get parent categories */
        function getCategoryById(id) {
        	var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-category-details/' + id,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getCategoryById();

        /* to delete a category from database */
        function deleteCategory(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-category';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("category_id", id);
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
        } //END deleteCategory();

        /* to change active/inactive status of category */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-category-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("category_id", obj.categoryId);
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
        }//END changeStatus()

        /* save category order*/
        function saveCategoryOrder(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'category-order-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("data", JSON.stringify(obj));
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
        } //END saveCategoryOrder();

        return self;

    };//END categoryService()
}());

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

(function () {
    angular.module('subjectApp', [
        'ui.router',
        'ui.router.compat',
        'ui.bootstrap',
        'angularValidator',
        'angucomplete-alt',
        'toastr',
        'angularUtils.directives.dirPagination',
        'angularjs-datetime-picker'
    ]).config(config);

    function config($stateProvider, $urlRouterProvider) {
        var subjectPath = 'app/components/subjects/';
        $stateProvider
            .state('administrator.subject', {
                url: '/subjects',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/index.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            })
            .state('administrator.subject.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/create.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            })
            .state('administrator.subject.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: subjectPath + 'views/create.html',
                        controller: 'SubjectController',
                        controllerAs: 'subject'
                    }
                }
            });

    }

}());
(function () {
    "use strict";
    angular
        .module('subjectApp')
        .service('subjectService', subjectService);

    subjectService.$inject = ['$http', 'APPCONFIG', '$q'];

    function subjectService($http, APPCONFIG, $q) {

        self.getParentCategories = getParentCategories;
        //self.getSubCategories = getSubCategories;
        self.saveSubject = saveSubject;
        self.getSubjects = getSubjects;
        self.getSubjectById = getSubjectById;
        self.deleteSubject = deleteSubject;
        self.changeStatus = changeStatus;

        /* to get parent categories */
        function getParentCategories() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-parent-categories';
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getParentCategories();

        /* save subject */
        function saveSubject(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'subject-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.parentCategoryId = (obj.parentCategoryId === undefined) ? '' : obj.parentCategoryId;
                    obj.subCategoryId = (obj.subCategoryId === undefined) ? 0 : obj.subCategoryId;
                    if (obj.subjectId != undefined && obj.subjectId != '') {
                        formData.append("subject_id", obj.subjectId);
                    }
                    formData.append("name", obj.name);
                    formData.append("parent_category_id", obj.parentCategoryId);
                    formData.append("sub_category_id", 0);
                    formData.append("name", obj.name);
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
        } //END saveSubject();

        /* to get all subjects */
        function getSubjects(pageNum, obj) {
            var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.parent_cat != undefined && obj.parent_cat != "")
                    where += '&parent_cat=' + obj.parent_cat;

                if (obj.sub_cat != undefined && obj.sub_cat != "")
                    where += '&sub_cat=' + obj.sub_cat;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;
            }

            $http({
                url: APPCONFIG.APIURL + 'get-subjects?' + where,
                method: "GET",
            })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }//END getSubjects();

        /* to get subject */
        function getSubjectById(id) {
            var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-subject-details/' + id,
                method: "GET",
            })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        } //END getSubjectById();

        /* to delete a subject from database */
        function deleteSubject(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-subject';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("subject_id", id);
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
        } //END deleteSubject();

        /* to change active/inactive status of subject */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-subject-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("subject_id", obj.subjectId);
                    formData.append("status", obj.status);
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
        } //END changeStatus();

        return self;

    };//END subjectService()
}());

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

(function () {
    angular.module('skillApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'angularjs-datetime-picker'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var skillPath = 'app/components/skills/';
        $stateProvider
            .state('administrator.skill', {
                url: '/skills',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/index.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })
            .state('administrator.skill.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/create.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })
            .state('administrator.skill.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: skillPath + 'views/create.html',
                        controller: 'SkillController',
                        controllerAs: 'skill'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());
(function() {
    "use strict";
    angular
        .module('skillApp')
        .service('skillService', skillService);

    skillService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function skillService($http, APPCONFIG, $q) {
        
        self.getParentCategories = getParentCategories;
        //self.getSubCategories = getSubCategories;
        self.saveSkill = saveSkill;
        self.getSkills = getSkills;
        self.getSkillById = getSkillById;
        self.deleteSkill = deleteSkill;
        self.changeStatus = changeStatus;

        /* to get parent categories */
        function getParentCategories() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-parent-categories';
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getParentCategories();

        /* to get sub categories */
        // function getSubCategories(parentId) {
        //     var deferred = $q.defer();
        //     var URL = APPCONFIG.APIURL + 'get-sub-categories?parent='+parentId;
        //     $http({
        //         method: 'GET',
        //         url: URL,
        //     }).then(function(response) {
        //         deferred.resolve(response);
        //     }, function(error) {
        //         deferred.reject(error);
        //     });
        //     return deferred.promise;
        // }//END getSubCategories();
        
        /* save skill */
        function saveSkill(obj) {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'skill-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.parentCategoryId = (obj.parentCategoryId === undefined) ? '' : obj.parentCategoryId;
                    obj.subCategoryId = (obj.subCategoryId === undefined) ? 0 : obj.subCategoryId;
                    if(obj.skillId != undefined && obj.skillId != '') {
                    	formData.append("skill_id", obj.skillId);
                    }
                    formData.append("name", obj.name);
                    formData.append("parent_category_id", obj.parentCategoryId);
                    formData.append("sub_category_id", 0);
                    formData.append("name", obj.name);
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
        } //END saveSkill();

        /* to get all skills */
        function getSkills(pageNum, obj) {
        	var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.parent_cat != undefined && obj.parent_cat != "")
                    where += '&parent_cat=' + obj.parent_cat;

                if (obj.sub_cat != undefined && obj.sub_cat != "")
                    where += '&sub_cat=' + obj.sub_cat;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;
			}
            
            $http({
                url: APPCONFIG.APIURL + 'get-skills?' + where,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getSkills();

        /* to get skill */
        function getSkillById(id) {
        	var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-skill-details/' + id,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getSkillById();

        /* to delete a skill from database */
        function deleteSkill(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-skill';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("skill_id", id);
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
        } //END deleteSkill();

        /* to change active/inactive status of skill */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-skill-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("skill_id", obj.skillId);
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

    };//END skillService()
}());

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

(function () {
    angular.module('currencyApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'toastr'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var currencyPath = 'app/components/currency/';
        $stateProvider
            .state('administrator.currency', {
                url: '/currency',
                views: {
                    'content@administrator': {
                        templateUrl: currencyPath + 'views/index.html',
                        controller: 'CurrencyController',
                        controllerAs: 'currency'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());
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

(function () {
    angular.module('budgetApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angularValidator', 'toastr', 'angularUtils.directives.dirPagination'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var budgetPath = 'app/components/budgets/';
        $stateProvider
            .state('administrator.budget', {
                url: '/budgets',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/index.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })
            .state('administrator.budget.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/create.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })
            .state('administrator.budget.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: budgetPath + 'views/create.html',
                        controller: 'BudgetController',
                        controllerAs: 'budget'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());
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

(function () {
    angular.module('packageApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oi.select'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var packagePath = 'app/components/packages/';
        $stateProvider
            .state('administrator.package', {
                url: '/packages',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/index.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })
            .state('administrator.package.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/create.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })
            .state('administrator.package.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: packagePath + 'views/create.html',
                        controller: 'PackageController',
                        controllerAs: 'package'
                    }
                }
            })

        //$locationProvider.html5Mode(true);
    }

}());
(function() {
    "use strict";
    angular
        .module('packageApp')
        .service('packageService', packageService);

    packageService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function packageService($http, APPCONFIG, $q) {
        
        self.getKeyTags = getKeyTags;
        self.savePackage = savePackage;
        self.getPackages = getPackages;
        self.getPackageById = getPackageById;
        self.deletePackage = deletePackage;
        self.changeStatus = changeStatus;

        /* to get key tags */
        function getKeyTags() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'get-key-tags';
            $http({
                method: 'GET',
                url: URL,
            }).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getKeyTags();
        
        /* save package */
        function savePackage(obj) {
        	var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'package-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.amount = (obj.amount === undefined) ? 0 : obj.amount;
                    obj.description = (obj.description === undefined) ? '' : obj.description;
                    if(obj.packageId != undefined && obj.packageId != '') {
                    	formData.append("package_id", obj.packageId);
                    }
                    formData.append("name", obj.name);
                    formData.append("amount", obj.amount);
                    formData.append("description", obj.description);
                    formData.append("tags", obj.tags);
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
        } //END savePackage();

        /* to get all packages */
        function getPackages(pageNum, obj) {
        	var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.amount != undefined && obj.amount != "")
                    where += '&amount=' + obj.amount;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;
			}
            
            $http({
                url: APPCONFIG.APIURL + 'get-packages?' + where,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getPackages();

        /* to get package */
        function getPackageById(id) {
        	var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-package-details/' + id,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getPackageById();

        /* to delete a package from database */
        function deletePackage(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-package';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("package_id", id);
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
        } //END deletePackage();

        /* to change active/inactive status of package */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-package-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("package_id", obj.packageId);
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

    };//END packageService()
}());

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

'use strict';
var adminApp = angular.module('administratorApp', [
    'ui.router',
    'ui.router.compat',
    'angularValidator',
    'ngMaterial',
    'authApp',
    'dashboardApp',
    'categoryApp',
    'subjectApp',
    'skillApp',
    'currencyApp',
    'budgetApp',
    'packageApp',
    'projectApp',
    'reasonApp'
]);

authenticateUser.$inject = ['authServices', '$state']

function authenticateUser(authServices, $state) {
    return authServices.checkValidUser(true);
} //END authenticateUser()

adminApp.config(funConfig);
adminApp.run(funRun);
adminApp.component("leftSideBar", {
    templateUrl: 'app/layouts/sidebar-left.html',
    controller: 'AdminController',
    controllerAs: 'admin'
});

// App Config
function funConfig($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {

    $stateProvider
        .state('administrator', {
            url: '',
            views: {
                '': {
                    templateUrl: 'app/layouts/layout.html'
                },
                'header@administrator': {
                    templateUrl: 'app/layouts/header.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                },
                // 'sidebarLeft@administrator': {
                //     templateUrl: 'app/layouts/sidebar-left.html'
                // },
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/index.html',
                },
                'footer@administrator': {
                    templateUrl: 'app/layouts/footer.html'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        })
        .state('administrator.dashboard', {
            url: '/dashboard',
            views: {
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/index.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        })
        .state('administrator.profile', {
            url: '/profile',
            views: {
                'content@administrator': {
                    templateUrl: 'app/components/dashboard/profile.html',
                    controller: 'DashboardController',
                    controllerAs: 'dashboard'
                }
            },
            resolve: {
                auth: authenticateUser
            }
        });

    /* set default date format of angular material datepicker */
    // $mdDateLocaleProvider.formatDate = function(date) {
    //     return moment(date).format('YYYY-MM-DD');
    // };
}


// App Run
funRun.$inject = ['$http', '$rootScope', '$state', '$location', '$log', '$transitions', 'authServices'];

function funRun($http, $rootScope, $state, $location, $log, $transitions, authServices) {
    $rootScope.isLogin = false;

    $rootScope.$on('auth:login:success', function (event, data) {
        $state.go('administrator.dashboard');
    }); // Event fire after login successfully

    $rootScope.$on('auth:access:denied', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after check access denied for user

    $rootScope.$on('auth:login:required', function (event, data) {
        $state.go('auth.login');
    }); //Event fire after logout    

    // $rootScope.$on('$locationChangeStart', function (event, next, current) {
    //     var restrictedPage = $.inArray($location.path(), ['/admin/auth/login', '/admin/auth/forgot-password']) === -1;
    //     var loggedIn = $rootScope.isLogin;
    //     if (!loggedIn) {
    //         // $location.path('/admin/dashboard');
    //         // //$state.go('administrator.dashboard');
    //         // return false;
    //         $state.go('auth.login');
    //         return false;
    //     }
    // });

    $transitions.onStart({
        to: '**'
    }, function ($transition$) {
        console.log('Transition #' + $transition$.$id + ': B) onStart to: ' + $transition$.to().name);
    });
}
(function() {
    "use strict";
    angular.module('administratorApp')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$location'];

    function AdminController($scope, $location) {
        var vm = this;

        vm.isActive = isActive;

        //to show active links in side bar
        function isActive(route) {
            var active = (route === $location.path());
            return active;
        } //END isActive active menu
    }

}());

(function () {
  'use strict';

  angular
    .module('administratorApp')
    .component('noResultFound', {
      templateUrl: 'app/components/shared/no_result_found.html'
    });
})();
(function () {
    angular.module('projectApp', ['toastr', 'angularUtils.directives.dirPagination', 'angularjs-datetime-picker','ui.bootstrap'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var projectPath = 'app/components/projects/';
        $stateProvider
            .state('administrator.projects', {
                url: '/projects',
                views: {
                    'content@administrator': {
                        templateUrl: projectPath + 'views/index.html',
                        controller: 'ProjectController',
                        controllerAs: 'project'
                    }
                }
            }).state('administrator.projects.view', {
                url: '/view/:id',
                views: {
                    'content@administrator': {
                        templateUrl: projectPath + 'views/view.html',
                        controller: 'ProjectController',
                        controllerAs: 'project'
                    }
                }
            });
        //$locationProvider.html5Mode(true);
    }

}());
(function() {
    "use strict";
    angular
        .module('projectApp')
        .service('projectService', projectService);

    projectService.$inject = ['$http', 'APPCONFIG', '$q']; 

    function projectService($http, APPCONFIG, $q) {
        
        self.getProjects = getProjects;
        self.getProjectById = getProjectById;
        self.approveProject = approveProject;
        self.deleteProject = deleteProject;

        /* to get all project */
        function getProjects(pageNum, obj) {
        	var deferred = $q.defer();
            var where = 'pageNum=' + pageNum;
            if (obj != undefined) {
                if (obj.name != undefined && obj.name != "")
                    where += '&name=' + obj.name;

                if (obj.category != undefined && obj.category != "")
                    where += '&category=' + obj.category;

                if (obj.created_at != undefined && obj.created_at != "") {
                    var formattedDate = moment(obj.created_at).format("YYYY-MM-DD");
                    where += '&created_at=' + formattedDate;
                }

                if (obj.status != undefined && obj.status != "")
                    where += '&status=' + obj.status;
			}
            
            $http({
                url: APPCONFIG.APIURL + 'get-projects?' + where,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getProjects();

        /* to get project */
        function getProjectById(id) {
        	var deferred = $q.defer();
            $http({
                url: APPCONFIG.APIURL + 'get-project-info?id=' + id,
                method: "GET",
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getProjectById();

        /* to approve project */
        function approveProject(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'approve-project';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    id = (id === undefined) ? '' : id;
                    formData.append("project_id", id);
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

        /* to delete a project from database */
        function deleteProject(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-project';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append("project_id", id);
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
        } //END deleteProject();   

        return self;

    };//END projectService()
}());

(function () {
    "use strict";
    angular.module('projectApp')
        .controller('ProjectController', ProjectController);

    ProjectController.$inject = ['$scope', '$state', 'projectService', 'toastr', 'SweetAlert', '$location'];

    function ProjectController($scope, $state, projectService, toastr, SweetAlert, $location) {
        var vm = this;
        vm.init = init;
        vm.getProjectList = getProjectList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalProjects = 0;
        vm.projectsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };
        vm.getProjectInfo = getProjectInfo;
        vm.approve = approve;
        vm.reset = reset;
        vm.deleteProject = deleteProject;

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "view") {
            if (path[3] == "") {
                $state.go('administrator.projects');
                return false;
            } else {
                getProjectInfo(path[3]);
            }
        }

        /* runs function on module load */
        function init() {}

        /* to format date*/
        function formatDate(date) {
            return moment(date).format("MMMM Do YYYY");
        } //END formatDate()

        /* for sorting project list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        } //END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getProjectList(newPage, searchInfo);
        } //END changePage()


        /* to get projects list */
        function getProjectList(newPage, obj) {
            projectService.getProjects(newPage, obj).then(function (response) {
                if (response.status == 200) {
                    if (response.data.projects && response.data.projects.length > 0) {
                        vm.totalProjects = response.headers('total_projects');
                        vm.projectList = response.data.projects;
                    } else {
                        vm.totalProjects = 0;
                        vm.projectList = "";
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getProjectList

        /* to get project information */
        function getProjectInfo(projectId) {
            projectService.getProjectById(projectId).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.projectDetails = response.data;
                        if (vm.projectDetails.project.approved == 0) {
                            $scope.disabled = false;
                        } else {
                            $scope.disabled = true;
                        }
                        if (vm.projectDetails.files && vm.projectDetails.files.length > 0) {
                            vm.images = [];
                            vm.otherFiles = [];
                            angular.forEach(vm.projectDetails.files, function (value, key) {
                                if (value.type == 'png' || value.type == 'jpg' || value.type == 'gif') {
                                    vm.images.push(value);
                                } else {
                                    vm.otherFiles.push(value);
                                }
                            });
                        }

                        //getAllReports(projectId);
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getProjectInfo();

        /* to approve/disapprove project */
        function approve(id) {
            if (id) {
                SweetAlert.swal({
                        title: "Are you sure you want to approve this project?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        html: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            projectService.approveProject(id).then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.status == 1) {
                                        $scope.disabled = true;
                                        SweetAlert.swal("Success!", response.data.message, "success");
                                        return true;
                                    }
                                } else {
                                    toastr.error(response.data.error, 'Error');
                                    return false;
                                }
                            }, function (error) {
                                toastr.error(error.data.error, 'Error');
                            });
                        }
                    });
            } else {
                toastr.error('No project id', 'Error');
            }
        } //END changeStatus()        

        /** to delete a project **/
        function deleteProject(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this project?",
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
                    projectService.deleteProject(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.projectList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deleteProject()

        /* to reset all search parameters in listing */
        function reset() {
            vm.search = [];
            getProjectList(1, '');
        } //END reset()

        vm.init();
    }

}());
(function () {
    angular.module('reasonApp', ['ui.router', 'ui.router.compat', 'ui.bootstrap', 'angucomplete-alt', 'toastr', 'angularUtils.directives.dirPagination', 'oi.select'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        var path = 'app/components/reasons/';
        $stateProvider
            .state('administrator.reason', {
                url: '/reasons',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/index.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
            .state('administrator.reason.create', {
                url: '/create',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/create.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
            .state('administrator.reason.edit', {
                url: '/edit/:id',
                views: {
                    'content@administrator': {
                        templateUrl: path + 'views/create.html',
                        controller: 'ReasonController',
                        controllerAs: 'reason'
                    }
                }
            })
    }

}());
(function () {
    "use strict";
    angular
        .module('reasonApp')
        .service('reasonService', reasonService);

    reasonService.$inject = ['$http', 'APPCONFIG', '$q'];

    function reasonService($http, APPCONFIG, $q) {

        self.saveReason = saveReason;
        self.getReasons = getReasons;
        self.getReasonById = getReasonById;
        self.deleteReason = deleteReason;
        self.changeStatus = changeStatus;

        /* save reason */
        function saveReason(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'reason-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    if (obj.reasonId != undefined && obj.reasonId != '') {
                        formData.append("reason_id", obj.reasonId);
                    }
                    formData.append("name", obj.name);
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
        } //END saveReason();

        /* to get all reasons */
        function getReasons(pageNum, obj) {
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
            }

            $http({
                    url: APPCONFIG.APIURL + 'get-reasons?' + where,
                    method: "GET",
                })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        } //END getReasons();

        /* to get reason */
        function getReasonById(id) {
            var deferred = $q.defer();
            $http({
                    url: APPCONFIG.APIURL + 'get-reason-details/' + id,
                    method: "GET",
                })
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        } //END getReasonById();

        /* to delete a reason from database */
        function deleteReason(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'delete-reason';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("reason_id", id);
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
        } //END deleteReason();

        /* to change active/inactive status of reason */
        function changeStatus(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'change-reason-status';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("reason_id", obj.reasonId);
                    formData.append("status", obj.status);
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
        } //END changeStatus();

        return self;

    }; //END reasonService()
}());
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
/* global angular */
"use strict";

var app = angular.module('tutoringApp', [
    'ui.router',
    'ui.router.compat',
    'angular-loading-bar',
    'administratorApp'
]);

app.constant('APPCONFIG', {
    //'APIURL': 'http://api.ts.dev/',
    'APIURL': 'https://tutoringservices-api-aman-raikwar.c9users.io/api/',
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
});
