(function () {
    "use strict";
    searchApp.controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'searchService', 'freelancerService', '$uibModal', 'toastr', '$interval']

    function SearchController($scope, $rootScope, $state, $stateParams, searchService, freelancerService, $uibModal, toastr, $interval) {

        $rootScope.bodylayout = 'profile loggedin';

        var vm = this;
        vm.searchProjects = searchProjects;
        vm.customSplitString = customSplitString;
        vm.getUserSkills = getUserSkills;
        vm.getRange = getRange;
        vm.projects = [];
        vm.projectSkills = [];
        vm.projectSkillsPercentage = [];
        vm.userSkills = [];
        vm.selectedSkills = [];
        vm.skillsCount = 0;
        vm.success = false;
        vm.reportInfo = {};

        vm.search = {
            category: $stateParams.area == undefined ? '' : $stateParams.area,
            budgetType: $stateParams.budgettype == undefined ? '' : $stateParams.budgettype,
            budget: $stateParams.budget == undefined ? '' : $stateParams.budget,
            urgency: $stateParams.urgency == undefined ? '' : $stateParams.urgency,
            skillsMatch: $stateParams.skillmatch == undefined ? '' : $stateParams.skillmatch
        };
        //console.log(vm.search);

        function searchProjects() {
            searchService.searchProjects(vm.search).then(function (response) {
                if (response.status == 200) {
                    vm.projects = response.data.projects;
                    console.log('Projects Found: ', response.data.projects.length);
                } else {
                    toastr.error(response.data.message, "Search Projects");
                }
            }).catch(function (response) {
                toastr.error(response.data.message, "Search Projects");
            });
        }

        function customSplitString(skills, project_id) {
            //console.log(skills, project_id);
            var arr = new Array();
            if (skills != '' && skills != null && skills != undefined) {
                arr = skills.split(',');
            }

            vm.projectSkills[project_id] = arr;

            var flag = 0;
            angular.forEach(vm.selectedSkills, function (value, key) {
                if (arr.indexOf(value) !== -1) {
                    flag++;
                    //console.log(value + ' already exists!');
                }
            });

            if (flag == 0) {
                vm.projectSkillsPercentage[project_id] = 0;
            } else {
                var calculatePercentage = (flag / arr.length) * 100;
                //console.log(calculatePercentage);
                vm.projectSkillsPercentage[project_id] = vm.getRange(Math.round(calculatePercentage));
            }

            //console.log(arr.length, flag, vm.selectedSkills.length);
        }

        function getRange(percentage) {
            if (percentage <= 100 && percentage >= 90) {
                return 100;
            } else if (percentage <= 90 && percentage > 80) {
                return 90;
            } else if (percentage <= 80 && percentage > 70) {
                return 80;
            } else if (percentage <= 70 && percentage > 60) {
                return 70;
            } else if (percentage <= 60 && percentage > 50) {
                return 60;
            } else if (percentage <= 50 && percentage > 40) {
                return 50;
            } else if (percentage <= 40 && percentage > 30) {
                return 40;
            } else if (percentage <= 30 && percentage > 20) {
                return 30;
            } else if (percentage <= 20 && percentage > 10) {
                return 20;
            } else if (percentage <= 10 && percentage > 0) {
                return 10;
            }
        }

        /* Get User Skills */
        function getUserSkills() {
            freelancerService.getUserSkills().then(function (response) {
                if (response.status == 200) {
                    vm.userSkills = [];
                    vm.selectedSkills = [];
                    var skillsCount = 0;

                    if (response.data.status !== 0) {
                        vm.userSkills = response.data.details;
                        if (Object.keys(response.data.details.category_details).length > 0) {
                            angular.forEach(response.data.details['category_details'], function (value, key) {
                                skillsCount += response.data.details['skill_details'][key].length;
                                if (response.data.details['skill_details'][key].length > 0) {
                                    angular.forEach(response.data.details['skill_details'][key], function (value1, key1) {
                                        vm.selectedSkills.push(value1.name);
                                    });
                                }
                            })
                        }

                        vm.skillsCount = skillsCount;
                    }
                }
            }).catch(function (response) {
                //toastr.error(response.data.message, 'Error');
            });
        }

    };

}());