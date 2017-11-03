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