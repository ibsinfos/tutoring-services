(function() {
    "use strict";
    angular.module('administratorApp')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$location'];

    function AdminController($scope, $location) {
        var vm = this;

        vm.isActive = isActive;

        //to show active links in side bar
        function isActive(route) {
            var active = (route === $location.path());
            return active;
        } //END isActive active menu
    }

}());
