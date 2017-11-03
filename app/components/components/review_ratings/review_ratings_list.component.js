(function () {
  'use strict';

  angular
    .module('sharedApp')
    .component('userReviewRatingList', {
        templateUrl: 'app/components/components/review_ratings/user-review-rating-list.html',
        controller: UserReviewRatingsListController,
        controllerAs: 'ratingList',
        bindings: {
            title : '@',
            userId : '<',
            type : '@'
        }
    });

    UserReviewRatingsListController.$inject = ['$state', '$rootScope', '$scope', 'toastr', 'reviewRatingService'];

    function UserReviewRatingsListController($state, $rootScope, $scope, toastr, reviewRatingService) {
        var vm = this; 
        vm.getUserReviewRatings = getUserReviewRatings;

        /* to get users rating and reviews */
        function getUserReviewRatings(id,type) {
            reviewRatingService.getReviewRatings(id,type).then(function (response) {
                if (response.status == 200) {
                    vm.reviewRatingsList = [];
                    if (response.data.review_ratings && response.data.review_ratings.length > 0) {
                        var currentDate = moment(new Date(), 'YYYY-MM-DD');
                        angular.forEach(response.data.review_ratings, function(value) {
                            var sum = 0, total = 0, rating = 0, percentage = 0;
                            sum = (value.job_quality * 1) + (value.communication * 1) + (value.availaibility * 1) + (value.time_management * 1) + (value.clarity_of_requirements * 1);
                            if(value.type == 1) {
                                total = 5;
                            } else {
                                total = 2;
                            }
                            rating = sum / total; 
                            percentage = (rating / total) * 100;
                            var endDate = moment(value.end_date, 'YYYY-MM-DD');
                            var days = endDate.diff(currentDate, 'days');
                            vm.reviewRatingsList.push({
                                id:value.id,
                                title:value.title,
                                description:value.full_review,
                                project:value.project_name,
                                rating:value.rating,
                                remainingDays:days,
                                rating: rating,
                                percentage: percentage
                            }); 
                        });
                        console.log(vm.reviewRatingsList);
                    } else {
                        vm.reviewRatingsList.length = 0;
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });   
        }
        
    }

})();

