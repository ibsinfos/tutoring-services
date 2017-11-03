authApp.controller('AuthController', AuthController);

AuthController.$inject = ['$rootScope', '$location', 'authServices', '$state', 'toastr'];

function AuthController($rootScope, $location, authServices, $state, toastr) {
    var vm = this;
    vm.login = login;
    vm.forgotPassword = forgotPassword;
    //vm.logout = logout;

    $rootScope.bodylayout = 'hold-transition login-page';
    $rootScope.htmllayout = 'add-bg';

    vm.user = {
        email: 'admin@dev.com',
        password: '123456'
    };

    function login(loginInfo) {
        authServices.checkLogin(loginInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "User Login");
                authServices.setAuthToken(response); //Set auth token
                $state.go('administrator.dashboard');
            } else {
                toastr.error(response.data.message, "User Login");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "User Login");
        });
    }; //END login()   

    function forgotPassword(userInfo) {
        authServices.checkForgotPassword(userInfo).then(function (response) {
            if (response.status == 200) {
                toastr.success(response.data.message, "Forgot Password");
            } else {
                toastr.error(response.data.message, "Forgot Password");
            }
        }).catch(function (response) {
            toastr.error(response.data.message, "Forgot Password");
        });
    }; //END forgotPassword() 

};