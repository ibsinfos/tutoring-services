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
