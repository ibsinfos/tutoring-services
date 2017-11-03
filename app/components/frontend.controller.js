(function () {
    "use strict";
    angular.module('frontendApp')
        .controller('FrontendController', FrontendController);

    FrontendController.$inject = ['$scope', '$rootScope', '$state', '$location']

    function FrontendController($scope, $rootScope, $state, $location) {

        var vm = this;
        $rootScope.currentStateName = $state.current.name;        
    };

}());