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
