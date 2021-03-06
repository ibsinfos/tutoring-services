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
