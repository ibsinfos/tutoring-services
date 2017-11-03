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
