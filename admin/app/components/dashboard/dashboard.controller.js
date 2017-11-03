var dashboardApp = angular.module('dashboardApp', [
    'ui.router',
    'ui.router.compat',
    'ui.bootstrap',
    'angularValidator',
    'toastr'
]);

dashboardApp.controller('DashboardController', DashboardController);

//AuthController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
function DashboardController($scope, $rootScope, $state, $location, authServices, dashboardService, toastr) {
    console.log('Dashboard Overview');
    var vm = this;
    vm.logoutUser = logoutUser;
    vm.updateProfile = updateProfile;
    vm.changePassword = changePassword;
    vm.passwordValidator = passwordValidator;
    vm.getOverview = getOverview;    

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

    function updateProfile(userInfo) {
        userInfo.token = $rootScope.user.token;
        dashboardService.updateProfile(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Update Profile");
            } else {
                toastr.error(response.data.message, "Update Profile");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Update Profile");
        });
    }; //END updateProfile()

    function changePassword(changePasswordInfo) {
        changePasswordInfo.token = $rootScope.user.token;
        dashboardService.changePassword(changePasswordInfo).then(function (response) {
            if (response.status == 200 && response.data.status == 1) {
                toastr.success(response.data.message, "Change Password");
                $scope.changePasswordForm.reset();
            } else {
                toastr.error(response.data.message, "Change Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Change Password");
        });
    }; //END changePassword()

    function getOverview() {
        token = $rootScope.user.token;
        dashboardService.getOverview(token).then(function (response) {
            if (response.status == 200) {
                vm.overview =  {
                    category: response.data.category,
                    subject: response.data.subject
                }
            } else {
                toastr.error(response.data.message, "Dashboard Overview");
            }
        // }).catch(function (response) {
        //     toastr.error(response.data.message, "Dashboard Overview");
        });
    }; //END getOverview()


    $scope.user = $rootScope.user;

    function logoutUser() {
        authServices.logout();
        $state.go('auth.login');
    }

};

dashboardApp.directive('showtab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});