sharedApp.controller('SharedController', SharedController);

SharedController.$inject = ['$scope', '$rootScope', '$location', '$state', 'toastr', '$uibModal', 'sharedService', 'authServices', 'sharedSocket'];

function SharedController($scope, $rootScope, $location, $state, toastr, $uibModal, sharedService, authServices, sharedSocket) {

    var vm = this;
    vm.openEditProfileModal = openEditProfileModal;
    vm.updateUserDetails = updateUserDetails;
    vm.uploadFiles = uploadFiles;
    vm.logoutUser = logoutUser;
    $rootScope.userProfilePhoto = 'assets/front/img/avatar.png';
    vm.changePassword = changePassword;
    vm.passwordValidator = passwordValidator;

    vm.userInfo = $rootScope.user;
    if (vm.userInfo.profile_image != '' && vm.userInfo.profile_image != undefined) {
        $rootScope.userProfilePhoto = vm.userInfo.profile_image;
    }

    /* Open Edit Profile of the User */
    function openEditProfileModal() {
        vm.taskForm = {};
        $scope.addFieldModal = $uibModal.open({
            animation: true,
            backdrop: false,
            windowClass: 'overlay',
            templateUrl: 'app/components/shared/user-edit-profile-popup.html',
            scope: $scope
        });
    }

    /* Update User Profile */
    function updateUserDetails(userInfo) {
        if(userInfo.hourly_rate == undefined) {
            userInfo.hourly_rate = 0;
        }
        sharedService.updateUserDetails(userInfo).then(function (response) {
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

    function uploadFiles(files, errFiles) {
        if (files.length > 0) {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function (event) {
                $scope.$apply(function ($scope) {
                    $rootScope.userProfilePhoto = event.target.result;
                });

                sharedService.updateUserPhoto(files[0]).then(function (response) {
                    if (response.status == 200) {
                        if (response.data.status == 0) {
                            toastr.error(response.data.message, 'Error');
                        } else {
                            toastr.success(response.data.message, 'Success');
                        }
                    }
                }).catch(function (response) {
                    toastr.error(response.data.message, 'Error');
                });
            }
        }
        if (errFiles.length > 0) {
            //console.log(errFiles);
            if (errFiles[0].$error == 'maxSize') {
                toastr.error("Max Size for the Photo is 2MB", 'User Profile Photo');
            } else if (errFiles[0].$error == 'pattern') {
                toastr.error("Invalid Photo", 'User Profile Photo');
            } else {
                toastr.error("Invalid Photo", 'User Profile Photo');
            }
        }
    }

    function logoutUser() {
        authServices.logout();
        $state.go('auth.login');
    }

    function passwordValidator(password) {

        if (!password) {
            return;
        }

        if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }

        // if (!password.match(/[A-Z]/)) {
        //     return "Password must have at least one capital letter";
        // }

        // if (!password.match(/[0-9]/)) {
        //     return "Password must have at least one number";
        // }

        return true;
    };

    function changePassword(changePasswordInfo) {
        sharedService.changePassword(changePasswordInfo).then(function (response) {
            if (response.status == 200 && response.data.status == 1) {
                toastr.success(response.data.message, "Change Password");
                changePasswordForm.reset();
            } else {
                toastr.error(response.data.message, "Change Password");
            }
        });
    }; //END changePassword()

}