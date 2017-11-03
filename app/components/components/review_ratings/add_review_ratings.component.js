(function () {
  'use strict';

  angular
    .module('sharedApp')
    .component('addUserReviewRating', {
        templateUrl: 'app/components/components/review_ratings/add-user-review-rating.html',
        controller: AddUserReviewRatingsController,
        controllerAs: 'rating',
        bindings: {
            projectId : '<',
            receiverId : '<',
            projectName : '<',
            action: '@',
            reviewId: '<',
            type:'@'
        }
    });

    AddUserReviewRatingsController.$inject = ['$state', '$rootScope', '$scope', '$uibModal', 'toastr', 'reviewRatingService'];

    function AddUserReviewRatingsController($state, $rootScope, $scope, $uibModal, toastr, reviewRatingService) {
        var vm = this; 
        vm.openReviewRatingModal = openReviewRatingModal;
        vm.submitReview = submitReview;
        vm.ratingForm = {};

        /* Open review and ratings modal box */
        function openReviewRatingModal(reviewId) {
            if(reviewId != undefined && reviewId != '') {
                vm.ratingForm.reviewId = reviewId;
                getReviewRatingById(reviewId);
            }
            $scope.addReviewRatingModal = $uibModal.open({
                animation: true,
                backdrop: false,
                windowClass: 'overlay',
                templateUrl: 'app/components/components/review_ratings/add-user-review-rating-popup.html',
                scope: $scope
            });
        }

        /* to get review and rating information */
        function getReviewRatingById(id) {
            reviewRatingService.getReviewRatingById(id).then(function (response) {
                if (response.status == 200) {
                    vm.type = response.data.review_ratings.type;
                    vm.ratingForm.type = response.data.review_ratings.type;
                    vm.ratingForm.title = response.data.review_ratings.title;
                    vm.ratingForm.projectId = response.data.review_ratings.project_id;
                    vm.ratingForm.receiverId = response.data.review_ratings.receiver_id;
                    vm.ratingForm.fullReview = response.data.review_ratings.full_review;
                    vm.ratingForm.job_quality = response.data.review_ratings.job_quality;
                    vm.ratingForm.communication = response.data.review_ratings.communication;
                    vm.ratingForm.availaibility = response.data.review_ratings.availaibility;
                    vm.ratingForm.time_management = response.data.review_ratings.time_management;
                    vm.ratingForm.clarity_of_requirements = response.data.review_ratings.clarity_of_requirements;
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }//END getReviewRatingById()

        function submitReview() {
            if(vm.action == "add") {
                vm.ratingForm.projectId = vm.projectId;
                vm.ratingForm.receiverId = vm.receiverId;
                vm.ratingForm.type = vm.type;
            }
            reviewRatingService.saveReviewRating(vm.ratingForm).then(function (response) {
                if (response.status == 200) {
                    toastr.success(response.data.message, 'Success');
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }

    }

})();

