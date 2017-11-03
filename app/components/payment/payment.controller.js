(function () {
    "use strict";
    paymentApp.controller('PaymentController', PaymentController);

    paypal.Button.driver('angular', window.angular);

    PaymentController.$inject = ['$scope', '$rootScope', '$state', '$location', 'toastr', 'paymentService', '$stateParams', '$uibModal', '$timeout']

    function PaymentController($scope, $rootScope, $state, $location, toastr, paymentService, $stateParams, $uibModal, $timeout) {

        $rootScope.bodylayout = 'profile loggedin';

        var vm = this;
        vm.checkProjectAndUserSlug = checkProjectAndUserSlug;
        vm.doMath_on_project_completion = doMath_on_project_completion;
        vm.start_date_popup = start_date_popup;
        vm.end_date_popup = end_date_popup;
        vm.selectedDate = selectedDate;
        vm.doMath_weekly_instalments = doMath_weekly_instalments;
        vm.selectedWeeklyStartDate = selectedWeeklyStartDate;
        vm.selectedWeeklyEndDate = selectedWeeklyEndDate;
        vm.calc_end_date_weekly_instalments = calc_end_date_weekly_instalments;
        vm.calc_end_date_on_project_completion = calc_end_date_on_project_completion;
        vm.invalidData = false;
        vm.invalidDataMessage = '';
        vm.startPayment = false;
        vm.startWeeklyPayment = false;
        vm.changeState = changeState;

        vm.projectCost = {};

        vm.start_date = {
            opened: false
        };

        vm.end_date = {
            opened: false
        };

        $scope.startDateOptions = {
            minDate: new Date(),
            maxDate: 0
        };

        $scope.endDateOptions = {
            minDate: new Date(),
            maxDate: 0
        };

        vm.projectSlug = $stateParams.projectSlug == undefined ? '' : $stateParams.projectSlug;
        vm.userSlug = $stateParams.userSlug == undefined ? '' : $stateParams.userSlug;

        function checkProjectAndUserSlug() {
            paymentService.checkProjectAndUserSlug(vm.projectSlug, vm.userSlug).then(function (response) {
                //toastr.success(response.data.message, 'Payment');
                vm.project_id = response.data.project_id;
                vm.freelancer_id = response.data.freelancer_id;
                vm.invalidData = false;
                vm.invalidDataMessage = '';
            }).catch(function (response) {
                toastr.error(response.data.message, 'Payment');
                vm.invalidData = true;
                vm.invalidDataMessage = response.data.message;
            });
        }

        console.log(vm.projectSlug, vm.userSlug);

        function doMath_on_project_completion() {
            console.log('doMath_on_project_completion');

            var agreed_project_cost = 0;
            var total_project_hours = 0;
            var max_hours_per_week = 0;
            var total_project_weeks = 0;
            var total_project_days = 0;

            if (vm.projectCost.agreed_project_cost != undefined) {
                agreed_project_cost = parseFloat(vm.projectCost.agreed_project_cost);
            }

            if (vm.projectCost.total_project_hours != undefined) {
                total_project_hours = parseFloat(vm.projectCost.total_project_hours);
            }

            if (vm.projectCost.max_hours_per_week != undefined) {
                max_hours_per_week = parseFloat(vm.projectCost.max_hours_per_week);
            }

            // ROUNDED to 2 decimal
            if (total_project_hours != 0 && max_hours_per_week != 0) {
                total_project_weeks = ((total_project_hours / max_hours_per_week).toFixed(2));
                total_project_days = ((total_project_weeks * 7).toFixed(2));
            }

            // CALCULATE TOTAL WEEKS AS INTEGER
            var total_project_weeks_as_integer = Math.ceil(total_project_weeks);

            // OUTPUT   
            vm.projectCost.project_cost_total = agreed_project_cost;
            vm.projectCost.total_project_weeks = total_project_weeks;
            vm.projectCost.total_project_weeks_as_integer = total_project_weeks_as_integer;
            vm.projectCost.total_project_days = total_project_days;
        }

        function calc_end_date_on_project_completion() {
            console.log('calc_end_date_on_project_completion');

            var tempStartDate = new Date(vm.projectCost.start_date);
            var start_date = tempStartDate.getFullYear() + "-" + (tempStartDate.getMonth() + 1) + "-" + tempStartDate.getDate();

            var tempEndDate = new Date(vm.projectCost.end_date);
            var end_date = tempEndDate.getFullYear() + "-" + (tempEndDate.getMonth() + 1) + "-" + tempEndDate.getDate();

            vm.data = {
                project_id: vm.project_id,
                freelancer_id: vm.freelancer_id,
                payment_type: 2,
                initial_amt: vm.projectCost.agreed_project_cost,
                project_hours: vm.projectCost.total_project_hours,
                hours_per_week: vm.projectCost.max_hours_per_week,
                start_date: start_date,
                end_date: end_date,
                agreement_desc: vm.projectCost.project_agreement,
                project_days: vm.projectCost.total_project_days,
                project_weeks: vm.projectCost.total_project_weeks,
                per_week_amt: 0,
                total_project_cost: vm.projectCost.project_cost_total,
                payment_status: 0,
                transaction_id: 0
            };

            //console.log(vm.projectCost, vm.data);
            paymentService.paymentProcess(vm.data).then(function (response) {
                //toastr.success(response.data.message, 'Payment');
                vm.paymentID = response.data.info;
                vm.startPayment = true;
            }).catch(function (response) {
                toastr.error(response.data.message, 'Payment');
            });
        }

        function start_date_popup() {
            vm.start_date.opened = true;
        };

        function end_date_popup() {
            vm.end_date.opened = true;
        };

        function selectedDate() {

            var total_project_hours2 = parseFloat(vm.projectCost.total_project_hours);
            var max_hours_per_week2 = parseFloat(vm.projectCost.max_hours_per_week);

            var total_project_weeks2 = 0;

            if (vm.projectCost.total_project_hours != undefined && vm.projectCost.max_hours_per_week != undefined && vm.projectCost.total_project_hours != 0 && vm.projectCost.max_hours_per_week != 0) {
                total_project_weeks2 = total_project_hours2 / max_hours_per_week2;
            }

            var total_number_of_days2 = total_project_weeks2 * 7;

            if (total_number_of_days2 != 0) {
                var tempStartDate = new Date(vm.projectCost.start_date);
                var default_end = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), tempStartDate.getDate() + (total_number_of_days2)); //this parses date to overcome new year date weirdness

                $scope.$watch('vm.projectCost.start_date', function () {
                    $scope.endDateOptions = {
                        minDate: vm.projectCost.start_date
                    };

                    vm.projectCost.end_date = default_end;
                });
            }
        }

        function doMath_weekly_instalments() {
            console.log('doMath_weekly_instalments');

            var hourly_rate = 0;
            var total_project_hours = 0;
            var max_hours_per_week = 0;
            var total_project_weeks = 0;

            if (vm.projectCost.hourly_rate != undefined) {
                hourly_rate = parseFloat(vm.projectCost.hourly_rate);
            }

            if (vm.projectCost.total_project_hours != undefined) {
                total_project_hours = parseFloat(vm.projectCost.total_project_hours);
            }

            if (vm.projectCost.max_hours_per_week != undefined) {
                max_hours_per_week = parseFloat(vm.projectCost.max_hours_per_week);
            }

            // ROUNDED to 2 decimal
            if (total_project_hours != 0 && max_hours_per_week != 0) {
                total_project_weeks = ((total_project_hours / max_hours_per_week).toFixed(2));
            }
            var total_project_days = ((total_project_weeks * 7).toFixed(2));
            var project_cost_total = ((hourly_rate * total_project_hours).toFixed(2));

            // CALCULATE TOTAL WEEKS AS INTEGER
            var total_project_weeks_as_integer = Math.ceil(total_project_weeks);

            // CALCULATE WEEKLY INSTALMENT VALUE
            var project_cost_weekly = ((project_cost_total / total_project_weeks_as_integer).toFixed(2));

            // OUTPUT
            vm.projectCost.project_cost_total = project_cost_total;
            vm.projectCost.project_cost_weekly = project_cost_weekly;
            vm.projectCost.total_project_weeks = total_project_weeks;
            vm.projectCost.total_project_weeks_as_integer = total_project_weeks_as_integer;
            vm.projectCost.total_project_days = total_project_days;

            var week_count = total_project_weeks_as_integer;
            var i2 = 1
            var str = '';
            for (var i = 0; i < week_count; i++) {
                str += "<p>Week " + i2 + ": <strong>$" + project_cost_weekly + "</strong></p>";
                i2++;
            }
            vm.projectCost.weekly_instalments_calc = str;
        }

        function selectedWeeklyStartDate() {
            console.log('selectedWeeklyStartDate');

            var total_project_hours2 = parseFloat(vm.projectCost.total_project_hours);
            var max_hours_per_week2 = parseFloat(vm.projectCost.max_hours_per_week);

            var total_project_weeks2 = 0;
            if (vm.projectCost.total_project_hours != undefined && vm.projectCost.max_hours_per_week != undefined && vm.projectCost.total_project_hours != 0 && vm.projectCost.max_hours_per_week != 0) {
                total_project_weeks2 = total_project_hours2 / max_hours_per_week2;
            }
            var total_number_of_days2 = total_project_weeks2 * 7;

            if (total_number_of_days2 != 0) {
                var tempStartDate = new Date(vm.projectCost.start_date);
                var default_end = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), tempStartDate.getDate() + (total_number_of_days2)); //this parses date to overcome new year date weirdness

                $scope.$watch('vm.projectCost.start_date', function () {
                    $scope.endDateOptions = {
                        minDate: vm.projectCost.start_date
                    };
                    vm.projectCost.end_date = default_end;
                });
            }
        }

        function selectedWeeklyEndDate() {
            console.log('selectedWeeklyEndDate');
        }

        function calc_end_date_weekly_instalments() {
            console.log('calc_end_date_weekly_instalments');

            var tempStartDate = new Date(vm.projectCost.start_date);
            var start_date = tempStartDate.getFullYear() + "-" + (tempStartDate.getMonth() + 1) + "-" + tempStartDate.getDate();

            var tempEndDate = new Date(vm.projectCost.end_date);
            var end_date = tempEndDate.getFullYear() + "-" + (tempEndDate.getMonth() + 1) + "-" + tempEndDate.getDate();

            vm.data = {
                project_id: vm.project_id,
                freelancer_id: vm.freelancer_id,
                payment_type: 1,
                initial_amt: vm.projectCost.hourly_rate,
                project_hours: vm.projectCost.total_project_hours,
                hours_per_week: vm.projectCost.max_hours_per_week,
                start_date: start_date,
                end_date: end_date,
                agreement_desc: vm.projectCost.project_agreement,
                project_days: vm.projectCost.total_project_days,
                project_weeks: vm.projectCost.total_project_weeks,
                per_week_amt: vm.projectCost.project_cost_weekly,
                total_project_cost: vm.projectCost.project_cost_total,
                payment_status: 0,
                transaction_id: 0
            };

            //console.log(vm.projectCost, vm.data);
            paymentService.paymentProcess(vm.data).then(function (response) {
                toastr.success(response.data.message, 'Payment');
                vm.paymentID = response.data.info;
                vm.startWeeklyPayment = true;
            }).catch(function (response) {
                toastr.error(response.data.message, 'Payment');
            });
        }

        $scope.opts = {
            env: 'sandbox',
            style: {
                label: 'paypal',
                size: 'medium',    // small | medium | large | responsive
                shape: 'rect',     // pill | rect
                color: 'blue',     // gold | blue | silver | black
                tagline: false
            },
            client: {
                sandbox: 'ASVyr6dK3hNiyWP9k7CAyWMP7eurLhr5sWxAnUP5XNUu5LUAnHhBHO2rq3eScHsH_sF2VWoui1yk3oWE',
                production: '<insert production client id>'
            },
            payment: function () {
                var env = this.props.env;
                var client = this.props.client;
                return paypal.rest.payment.create(env, client, {
                    transactions: [
                        {
                            amount: { total: vm.projectCost.project_cost_total, currency: 'GBP' },
                        }
                    ]
                });
            },
            commit: true, // Optional: show a 'Pay Now' button in the checkout flow
            onAuthorize: function (data, actions) {
                console.log(data);
                // Optional: display a confirmation page here
                return actions.payment.execute().then(function () {
                    // Show a success page to the buyer
                    console.log(data);
                    var paymentInfo = {
                        'id': vm.paymentID,
                        'project_id': vm.project_id,
                        'freelancer_id': vm.freelancer_id,
                        'intent': data.intent,
                        'payer_id': data.payerID,
                        'payment_id': data.paymentID,
                        'payment_token': data.paymentToken
                    }

                    paymentService.paymentDone(paymentInfo).then(function (response) {
                        toastr.success(response.data.message, 'Payment');
                        $state.go('root.thankyou');
                    }).catch(function (response) {
                        toastr.error(response.data.message, 'Payment');
                    });
                });
            }
        };

        function changeState() {
            $timeout(function () {
                $state.go('root');
            }, 5000);
        }


    };

}());