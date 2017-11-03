(function () {
    "use strict";

    angular
        .module('sharedApp')
        .directive('disableContextMenu', disableContextMenu);

    function disableContextMenu() {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('contextmenu', function (e) {
                    e.preventDefault();
                });
            }
        }
    }; //END disableContextMenu()  

}());