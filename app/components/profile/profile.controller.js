(function () {
    "use strict";
    profileApp.controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$rootScope', '$state', '$location', 'toastr', 'profileService', '$stateParams']

    function ProfileController($scope, $rootScope, $state, $location, toastr, profileService, $stateParams) {

        $rootScope.bodylayout = 'profile loggedin';

        var vm = this;
        vm.searchFreelancer = searchFreelancer;
        $rootScope.userProfilePhoto = 'assets/front/img/avatar.png';
       
        vm.show = [];
        vm.slug = $stateParams.slug == undefined ? '' : $stateParams.slug;

        function searchFreelancer() {
            profileService.searchFreelancer(vm.slug).then(function (response) {
                if (response.status == 200) {
                    vm.userProfile = response.data.profile;

                    if (vm.userProfile.profile_image != '' && vm.userProfile.profile_image != undefined) {
                        vm.userProfilePhoto = vm.userProfile.profile_image;
                    }

                    vm.userSkills = [];
                    vm.selectedSkills = [];
                    var skillsCount = 0;

                    if (response.data.status !== 0) {
                        vm.userSkills = response.data.skills;
                        if (Object.keys(response.data.skills.category_details).length > 0) {
                            angular.forEach(response.data.skills['category_details'], function (value, key) {
                                skillsCount += response.data.skills['skill_details'][key].length;
                                if (response.data.skills['skill_details'][key].length > 0) {
                                    angular.forEach(response.data.skills['skill_details'][key], function (value1, key1) {
                                        value1['parent_category_id'] = key;
                                        vm.selectedSkills.push(value1);
                                        vm.show[value1.id] = true;
                                    });
                                }
                            })
                        }
                    }

                    vm.skillsCount = skillsCount;

                    console.log('Profile Found: ', response.data.profile);
                    console.log('Skills Found: ', response.data.skills);
                } else {
                    toastr.error(response.data.message, "Search Profile");
                }
            });
        }

    };

}());