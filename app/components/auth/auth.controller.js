authApp.controller('AuthController', AuthController);

AuthController.$inject = ['$scope', '$rootScope', '$location', 'authServices', 'homeService', '$state', 'toastr', 'APPCONFIG'];

function AuthController($scope, $rootScope, $location, authServices, homeService, $state, toastr, APPCONFIG) {
    var vm = this;
    vm.signIn = signIn;
    vm.signUpFreelancer = signUpFreelancer;
    vm.signUpEmployer = signUpEmployer;
    vm.forgotPassword = forgotPassword;
    vm.passwordValidator = passwordValidator;
    vm.getBudgets = getBudgets;
    vm.getUrgency = getUrgency;
    vm.getCategories = getCategories;
    vm.getSkills = getSkills;
    vm.getCheckedSkills = getCheckedSkills;
    vm.stepAccount = stepAccount;
    vm.stepSkills = stepSkills;
    vm.stepPersonal = stepPersonal;
    vm.addPrinciple = addPrinciple;
    vm.removePrinciple = removePrinciple;

    vm.stepPostProject = stepPostProject;

    vm.originalCategoriesCount = 0;
    vm.categories = {};
    vm.selectedCategories = [];
    vm.selectedSkills = [];
    vm.skills = {};
    vm.flagAddPrinciple = true;
    vm.choices = [{
        id: 'choice1'
    }];
    vm.urgencyRange = [];

    $rootScope.bodylayout = 'profile loggedout';

    function signIn(loginInfo) {
        authServices.checkLogin(loginInfo).then(function (response) {
            if (response.status == 200) {
                //toastr.success(response.data.message, "User Login");
                authServices.setAuthToken(response); //Set auth token
                $state.go('root');
            } else {
                toastr.error(response.data.message, "User Login");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "User Login");
        });
    } //END signIn()  

    function signUpEmployer(employerInfo) {
        employerInfo.skills = vm.selectedSkills;
        authServices.signUpEmployer(employerInfo).then(function (response) {
            if (response.status == 200) {
                if (response.data.status == 1) {
                    toastr.success(response.data.message, "User SignUp");
                    $scope.msform.reset();
                    $state.go('auth.login');
                } else {
                    toastr.error(response.data.message, "User SignUp");
                }
            } else {
                toastr.error(response.data.message, "User SignUp");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "User SignUp");
        });
    } //END signUpEmployer()

    function signUpFreelancer(userInfo) {
        userInfo.skills = vm.selectedSkills;
        authServices.signUpFreelancer(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "User SignUp");
                $scope.msform.reset();
                $state.go('auth.login');
            } else {
                toastr.error(response.data.message, "User SignUp");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "User SignUp");
        });
    } //END signUpFreelancer()  

    function forgotPassword(userInfo) {
        authServices.checkForgotPassword(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Forgot Password");
                $state.go('auth.login');
            } else {
                toastr.error(response.data.message, "Forgot Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Forgot Password");
        });
    } //END forgotPassword()  

    function stepAccount(userInfo) {
        if ($scope.msform.email.$valid && $scope.msform.password.$valid && $scope.msform.confirmpassword.$valid) {
            authServices.checkEmailExists(userInfo.email).then(function (response) {
                if (response.status == 200) {
                    $scope.btnAccount = 'next';
                } else {
                    toastr.error(response.data.message, "Email Exists");
                }
            }).catch(function (response) {
                if (response.data.message !== '' && response.data.message !== undefined) {
                    toastr.error(response.data.message, "Email Exists");
                } else {
                    toastr.error(response.data.message.email, "Email Exists");
                }
            });
        }
    }

    function stepPostProject(employerInfo) {
        if ($scope.msform.project_name.$valid && $scope.msform.project_description.$valid) {
            $scope.btnPostProject = 'next';
        }
    }

    function stepSkills(userInfo) {
        if (checkSkillInArray()) {
            $scope.btnSkills = 'next';
        } else {
            toastr.error("Please select any Principle with Skills", "Skills");
        }
    }

    function stepPersonal(userInfo) {
        if ($scope.msform.$valid) {
            $scope.btnPersonal = 'submit';
        }
    }

    function passwordValidator(password) {

        if (!password) {
            return;
        }

        if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }

        if (!password.match(/[A-Z]/)) {
            return "Password must have at least one capital letter";
        }

        if (!password.match(/[0-9]/)) {
            return "Password must have at least one number";
        }

        return true;
    }

    function getCategories(key) {
        vm.categories[key] = [];
        homeService.getCategories().then(function (response) {
            if (response.status == 200) {
                if (response.data.categories && response.data.categories.length > 0) {
                    vm.projectCategories = response.data.categories;
                    vm.originalCategoriesCount = response.data.categories.length;
                    if (key == 0) {
                        vm.categories[key] = response.data.categories;
                    } else {
                        vm.categories[key] = response.data.categories.filter(checkSelectedCategoryExists);
                    }
                }
            }
        }, function (error) {
            toastr.error(error.data.error, 'Error');
        });
    } //END getCategories()

    function checkSelectedCategoryExists(item) {
        if (vm.selectedCategories.indexOf(item.id) === -1) {
            return true;
        } else {
            return false;
        }
    }

    function getSkills(category, key, oldValue) {
        if (category != '' && category != null) {
            if (!checkSelectedCategoryExists(category)) {
                vm.userInfo.category[key] = oldValue;
                toastr.warning("You have already selected that Principle", "Warning");
                return false;
            }
        }

        vm.selectedCategories[key] = [];
        vm.skills[key] = {};
        vm.flagAddPrinciple = true;
        if (category != '' && category != null) {
            vm.flagAddPrinciple = false;
            vm.selectedCategories[key] = category.id;
            homeService.getSkills(category.id).then(function (response) {
                if (response.status == 200) {
                    if (response.data.skills && response.data.skills.length > 0) {
                        vm.skills[key] = response.data.skills;
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        }

        if (vm.originalCategoriesCount == vm.choices.length) {
            vm.flagAddPrinciple = true;
        }
    } //END getSkills()    

    function getCheckedSkills(category_id, skill_id, active) {
        var obj = {
            category: category_id,
            skills: [skill_id]
        };

        if (active)
            addSkillToArray(obj);
        else
            removeSkillFromArray(obj)
    }

    function addSkillToArray(obj) {
        if (vm.selectedSkills.length == 0) {
            vm.selectedSkills.push(obj);
        } else {
            var flag = 0;
            for (var i = 0; i < vm.selectedSkills.length; i++) {
                if (vm.selectedSkills[i]['category'] == obj.category) {
                    vm.selectedSkills[i]['skills'].push(obj.skills[0]);
                    flag = 1;
                }
            }

            if (flag == 0) {
                vm.selectedSkills.push(obj);
            }
        }
    }

    function removeSkillFromArray(obj) {
        if (vm.selectedSkills.length > 0) {
            for (var i = 0; i < vm.selectedSkills.length; i++) {
                if (vm.selectedSkills[i]['category'] == obj.category) {
                    vm.selectedSkills[i]['skills'].splice(vm.selectedSkills[i]['skills'].indexOf(obj.skills[0]), 1);
                }
            }
        }
    }

    function checkSkillInArray() {
        var flag = false;
        if (vm.selectedSkills.length > 0) {
            for (var i = 0; i < vm.selectedSkills.length; i++) {
                if (vm.selectedSkills[i]['category'] != '' && vm.selectedSkills[i]['skills'].length > 0) {
                    flag = true;
                }
            }
        }

        return flag;
    }

    function addPrinciple() {
        vm.flagAddPrinciple = true;
        if (vm.originalCategoriesCount != vm.choices.length) {
            var newItemNo = vm.choices.length + 1;
            vm.getCategories(vm.choices.length);
            vm.choices.push({
                'id': 'choice' + newItemNo
            });
        }
    }

    function removePrinciple(key, category) {
        vm.flagAddPrinciple = false;
        if (category != '' && category != null) {
            vm.selectedCategories.splice(vm.selectedCategories.indexOf(category.id), 1);
        }
        var lastItem = vm.choices.length - 1;
        vm.choices.splice(lastItem);
    }

    /* to get all budgets */
    function getBudgets(budgetType) {
        homeService.getBudgets(budgetType).then(function (response) {
            if (response.status == 200) {
                if (response.data.budget.length > 0) {
                    vm.budgets = response.data.budget;
                    vm.budgetRange = [];
                    angular.forEach(vm.budgets, function (value, key) {
                        var currency = '';
                        if (value.currency == 1) {
                            currency = '$';
                        } else {
                            currency = '£';
                        }
                        vm.budgetRange.push({
                            'id': value.id,
                            'range': currency + value.range_from + " - " + currency + value.range_to,
                        });
                    });
                } else {
                    vm.budgets = ""
                }
            } else {
                vm.budgets = "";
            }
        }, function (error) {
            //toastr.error(error.data.error, 'Error');
        });
    } //END getBudgets()	   

    /* to get ugency */
    function getUrgency() {
        homeService.getUrgency().then(function (response) {
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
            //toastr.error(error.data.error, 'Error');
        });
    } //END getUrgency()	

    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        vm.specificationFiles = [];
        angular.forEach(files, function (file) {
            vm.specificationFiles.push(file);
            // file.upload = Upload.upload({
            //     url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            //     data: {file: file}
            // });

            // file.upload.then(function (response) {
            //     $timeout(function () {
            //         file.result = response.data;
            //     });
            // }, function (response) {
            //     if (response.status > 0)
            //         $scope.errorMsg = response.status + ': ' + response.data;
            // }, function (evt) {
            //     file.progress = Math.min(100, parseInt(100.0 * 
            //                              evt.loaded / evt.total));
            // });
        });
        //console.log(vm.specificationFiles);
        vm.employerInfo.files = vm.specificationFiles;
    }

}