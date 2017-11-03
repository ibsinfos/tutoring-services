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
