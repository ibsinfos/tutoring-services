var homeApp = angular.module('homeApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator',
    'toastr'
]);

homeApp.controller('HomeController', HomeController);

function HomeController($scope, $rootScope, $state, $location, authServices, homeService, toastr) {
    //console.info('Home Controller Loaded!');

    if (!$rootScope.isLogin) {
        $rootScope.bodylayout = 'profile loggedout';
    }

    var vm = this;
    vm.updateProfile = updateProfile;
    vm.changePassword = changePassword;
    vm.resetChangePassword = resetChangePassword;
    vm.logoutUser = logoutUser;
    vm.passwordValidator = passwordValidator;

    function updateProfile(userInfo) {
        dashboardService.updateProfile(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Update Profile");
                $state.go('auth.profile');
            } else {
                toastr.error(response.data.message, "Update Profile");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Update Profile");
        });
    }; //END updateProfile()

    function changePassword(passwordInfo) {
        passwordInfo.token = $rootScope.user.token;
        dashboardService.changePassword(passwordInfo).then(function (response) {
            if (response.status == 200 && response.data.status == 1) {
                resetChangePassword();
                toastr.success(response.data.message, "Change Password");
                $state.go('auth.profile');
            } else {
                toastr.error(response.data.message, "Change Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Change Password");
        });
    }; //END changePassword()


    $scope.user = $rootScope.user;
    //console.log('User: ', $rootScope.user);

    function logoutUser() {
        authServices.logout();
        $state.go('auth.login');
    }

    function resetChangePassword() {
        vm.changepassword = angular.copy({});
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
    };

};