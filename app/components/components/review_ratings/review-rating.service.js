(function () {
    "use strict";
    angular
        .module('sharedApp')
        .service('reviewRatingService', reviewRatingService);

    reviewRatingService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function reviewRatingService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.saveReviewRating = saveReviewRating;
        self.getReviewRatings = getReviewRatings;
        self.getReviewRatingById = getReviewRatingById;

        /* to save review and rating */
        function saveReviewRating(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-save-review-rating';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    obj.title = (obj.title === undefined) ? '' : obj.title;
                    obj.fullReview = (obj.fullReview === undefined) ? '' : obj.fullReview;
                    obj.projectId = (obj.projectId === undefined) ? '' : obj.projectId;
                    obj.receiverId = (obj.receiverId === undefined) ? '' : obj.receiverId;
                    obj.job_quality = (obj.job_quality === undefined) ? 0 : obj.job_quality;
                    obj.communication = (obj.communication === undefined) ? 0 : obj.communication;
                    obj.availaibility = (obj.availaibility === undefined) ? 0 : obj.availaibility;
                    obj.time_management = (obj.time_management === undefined) ? 0 : obj.time_management;
                    obj.clarity_of_requirements = (obj.clarity_of_requirements === undefined) ? 0 : obj.clarity_of_requirements;
                    formData.append("token", authServices.getAuthToken());
                    formData.append("title", obj.title);
                    formData.append("full_review", obj.fullReview);
                    formData.append("project_id", obj.projectId);
                    formData.append("receiver_id", obj.receiverId);
                    formData.append("job_quality", obj.job_quality);
                    formData.append("communication", obj.communication);
                    formData.append("availaibility", obj.availaibility);
                    formData.append("time_management", obj.time_management);
                    formData.append("clarity_of_requirements", obj.clarity_of_requirements);
                    formData.append("type", obj.type);
                    if(obj.reviewId != undefined && obj.reviewId != '') {
                        formData.append("review_id", obj.reviewId);
                    }
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
        } //END saveReviewRating();

        /* to get reviews and ratings */
        function getReviewRatings(id,type) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-review-ratings-list';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    id = (id === undefined) ? '' : id;
                    formData.append("token", authServices.getAuthToken());
                    formData.append("id", id);
                    formData.append("type", type);
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
        }//END getReviewRatings();

        /* to get review and rating information */
        function getReviewRatingById(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-review-ratings';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    id = (id === undefined) ? '' : id;
                    formData.append("token", authServices.getAuthToken());
                    formData.append("id", id);
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
        }

        return self;

    };//END reviewRatingService()



}());