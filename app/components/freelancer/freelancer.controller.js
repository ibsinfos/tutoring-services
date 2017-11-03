(function () {
    "use strict";
    freelancerApp.controller('FreelancerController', FreelancerController);

    FreelancerController.$inject = ['$scope', '$rootScope', '$state', '$location', 'toastr', 'freelancerService', '$uibModal', 'homeService', 'APPCONFIG', 'sharedSocket', '$interval']

    function FreelancerController($scope, $rootScope, $state, $location, toastr, freelancerService, $uibModal, homeService, APPCONFIG, sharedSocket, $interval) {

        $rootScope.bodylayout = 'profile loggedin';

        var vm = this;
        vm.openBankDetailsModal = openBankDetailsModal;
        vm.updateBankDetails = updateBankDetails;
        vm.getBankDetails = getBankDetails;
        vm.getUserSkills = getUserSkills;
        vm.openSkillsModal = openSkillsModal;

        vm.getCategories = getCategories;
        vm.showSkillsboard = showSkillsboard;
        vm.showCategoryBoard = showCategoryBoard;


        vm.userInfo = $rootScope.user;
        vm.userSkills = [];
        vm.RemoteUrl = APPCONFIG.APIURL + 'front-search-categories';
        vm.currentSelectedCategory = '';
        vm.open = [];
        vm.show = [];
        vm.setActive = setActive;
        vm.selectedSkills = [];
        vm.removeSelectedSkill = removeSelectedSkill;
        vm.searchBySkill = true;
        vm.searchSkills = searchSkills;
        vm.updateSkills = updateSkills;

        vm.getBudgets = getBudgets;
        vm.getUrgency = getUrgency;
        vm.getPercentage = getPercentage;
        vm.searchProject = searchProject;

        /* Get Bank Details of the User */
        function getBankDetails() {
            freelancerService.getBankDetails().then(function (response) {
                if (response.status == 200) {
                    if (response.data.status !== 0) {
                        vm.bankInfo = response.data.details;
                    }
                }
            }).catch(function (response) {
                //toastr.error(response.data.message, 'Error');
            });
        }

        /* Open Bank Details Modal for the User */
        function openBankDetailsModal() {
            vm.taskForm = {};
            $scope.addFieldModal = $uibModal.open({
                animation: true,
                backdrop: false,
                windowClass: 'overlay',
                templateUrl: 'app/components/freelancer/user-bank-detail-popup.html',
                scope: $scope
            });
            vm.getBankDetails();
        }

        /* Update Bank Details of the User */
        function updateBankDetails(bankInfo) {
            freelancerService.updateBankDetails(bankInfo).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 0) {
                        toastr.error(response.data.message, 'Error');
                    } else {
                        toastr.success(response.data.message, 'Success');
                        $scope.addFieldModal.close();
                    }
                }
            }).catch(function (response) {
                toastr.error(response.data.message, 'Error');
            });
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
                                        value1['parent_category_id'] = key;
                                        vm.selectedSkills.push(value1);
                                        vm.show[value1.id] = true;
                                    });
                                }
                            })
                        }
                    }

                    vm.skillsCount = skillsCount;
                }
            }).catch(function (response) {
                //toastr.error(response.data.message, 'Error');
            });
        }

        /* Open Bank Details Modal for the User */
        function openSkillsModal() {
            vm.taskForm = {};
            $scope.addFieldModal = $uibModal.open({
                animation: true,
                backdrop: false,
                windowClass: 'overlay',
                templateUrl: 'app/components/freelancer/user-skills-popup.html',
                scope: $scope,
                size: 'lg'
            });
            vm.currentSelectedCategory = '';
            vm.searchBySkill = true;
            vm.searchText = '';
            vm.skillsBySearchTextStatus = false;
            vm.getCategories();
        }

        function getCategories() {
            vm.categories = [];
            homeService.getCategories().then(function (response) {
                if (response.status == 200) {
                    if (response.data.categories && response.data.categories.length > 0) {
                        vm.categories = response.data.categories;
                    }
                }
            }, function (error) {
                //toastr.error(error.data.error, 'Error');
            });
        } //END getCategories()        

        function showSkillsboard(category) {
            vm.skillsByCategoryId = {};
            vm.currentSelectedCategory = category.name;
            vm.skillsByCategoryIdStatus = false;

            freelancerService.getSkillsByCategoryId(category.id).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status !== 0) {
                        vm.skillsByCategoryId = response.data.skills;
                        vm.skillsByCategoryIdStatus = true;
                    }
                }
            });
        }

        function showCategoryBoard() {
            vm.currentSelectedCategory = '';
            vm.searchBySkill = true;
            vm.searchText = '';
        }

        function setActive(skill) {
            vm.show[skill.id] = true;

            var flag = false;
            angular.forEach(vm.selectedSkills, function (value, key) {
                if (value.id == skill.id) {
                    flag = true;
                }
            }, this);

            if (!flag) {
                vm.selectedSkills.push(skill);
            }
        }

        function removeSelectedSkill(skill, skillIndex) {
            vm.selectedSkills.splice(skillIndex, 1);
            vm.show[skill.id] = false;
        }

        function searchSkills(e) {
            vm.searchText = e.target.value;
            vm.searchBySkill = true;

            if (e.target.value !== '') {
                vm.searchBySkill = false;
                vm.skillsBySearchText = [];
                vm.skillsBySearchTextStatus = false;

                freelancerService.searchSkills(e.target.value).then(function (response) {
                    if (response.status == 200) {
                        if (response.data.status !== 0) {
                            vm.skillsBySearchText = response.data.skills;
                            vm.skillsBySearchTextStatus = true;
                        }
                    }
                });
            }
        }

        function updateSkills() {
            freelancerService.updateUserSkills(vm.selectedSkills).then(function (response) {
                if (response.data.status == 1) {
                    toastr.success(response.data.message, 'Success');
                    vm.getUserSkills();
                } else {
                    toastr.error(response.data.message, 'Error');
                }
            }).catch(function (response) {
                toastr.error(response.data.message, 'Error');
            })
        }


        /* to get all budgets */
        function getBudgets(budgetType) {
            if (budgetType != undefined) {
                vm.budgetRange = [];

                freelancerService.getBudgets(budgetType).then(function (response) {
                    if (response.status == 200) {
                        if (response.data.budget.length > 0) {
                            vm.budgets = response.data.budget;
                            vm.budgetRange = [];
                            angular.forEach(vm.budgets, function (value, key) {
                                vm.budgetRange.push({
                                    'id': value.id,
                                    'range': value.symbol + value.range_from + " - " + value.symbol + value.range_to,
                                });
                            });
                        }
                    }
                }, function (error) {
                    toastr.error(error.data.error, 'Error');
                });
            } else {
                toastr.error('Please select a budget type', 'Error');
            }
        } //END getBudgets()    

        /* to get ugency */
        function getUrgency() {
            freelancerService.getUrgency().then(function (response) {
                if (response.status == 200) {
                    if (response.data.urgency.length > 0) {
                        vm.urgency = response.data.urgency;
                        vm.urgencyRange = [];
                        angular.forEach(response.data.urgency, function (value, key) {
                            var range = '';
                            if (value.days >= 7) {
                                range = "Start in " + value.days + " days";
                            } else {
                                range = "Start this week";
                            }

                            vm.urgencyRange.push({
                                'id': value.id,
                                'range': range
                            });
                        });
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getUrgency() 

        //$interval(function () {
        sharedSocket.emit('send:message', {
            message: 'Hello Thomas!'
        });
        //}, 50000);

        sharedSocket.on('helloAll', function (message) {
            //console.log(message);
            var notificationTitle = '<b>ActionScript Developer</b>';
            var notificationMessage = '<div><p><b>HTML</b></p><p>Looking for a PHP developer who can work on actionscript under a budget of $100.</p><p>$100-$250 USD</p></div>';

            toastr.success(notificationMessage, notificationTitle, {
                allowHtml: true,
                closeButton: true,
                closeHtml: '<button>&times;</button>',
                progressBar: true,
                delay: 2000,
                extendedTimeOut: 1000,
                timeOut: 3000,
                toastClass: 'toast project-toast',
                positionClass: 'toast-bottom-left',
                onTap: function () {
                    alert('Hello FDC!')
                }
            });
        });
        /* to get percentage */
        function getPercentage() {
            freelancerService.getPercentage().then(function (response) {
                if (response.status == 200) {
                    if (response.data.percentage.length > 0) {
                        //console.log(response.data.percentage);
                        vm.percentage = [];
                        angular.forEach(response.data.percentage, function (value, key) {
                            var per = '';
                            if (value.percentage <= 100) {
                                per = value.percentage + " %+";
                            } else {
                                per = value.percentage + " %";
                            }

                            vm.percentage.push({
                                'id': value.id,
                                'percentage': value.percentage,
                                'value': per
                            });
                        });
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getUrgency() 

        /* to search projects */
        function searchProject(searchInfo) {
            var searchParams = {
                area: '',
                budgettype: '',
                budget: '',
                urgency: '',
                skillmatch: ''
            };
            if (searchInfo != '' && searchInfo != undefined) {
                searchParams = {
                    area: searchInfo.category,
                    budgettype: searchInfo.budgetType,
                    budget: searchInfo.budget,
                    urgency: searchInfo.urgency,
                    skillmatch: searchInfo.percentage
                }
            }

            $state.go('root.search', searchParams);
        } //searchProject()

    };

}());