(function () {
	"use strict";
	angular.module('projectApp')
		.controller('ProjectController', ProjectController);

	ProjectController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'projectService', 'toastr', '$uibModal', '$timeout', '$interval']

	function ProjectController($scope, $rootScope, $state, $stateParams, $location, projectService, toastr, $uibModal, $timeout, $interval) {

		var vm = this;
		vm.getProjectDetails = getProjectDetails;
		vm.customSplitString = customSplitString;
		vm.getRange = getRange;
		vm.openReportAbuseModal = openReportAbuseModal;
		vm.reportAbuse = reportAbuse;
		vm.getAllReasons = getAllReasons;
		vm.bidonthis = bidonthis;
		vm.addTasks = addTasks;
		vm.removeTask = removeTask;
		vm.createBid = createBid;
		vm.getProjectBids = getProjectBids;
		vm.getDays = getDays;
		vm.getHours = getHours;
		vm.reportInfo = {};
		vm.projectBids = 0;
		vm.choices = [{
			id: 'choice1'
		}];

		vm.project_slug = $stateParams.slug;
		vm.bidNow = true;
		vm.bidNowForm = true;

		function getProjectDetails(project_slug) {
			projectService.singleProject(project_slug).then(function (response) {
				if (response.status == 200) {
					vm.projectDetail = response.data.project;
					vm.projectDetail.avgbid = response.data.avgbid;
					vm.projectBids = response.data.bids;
					vm.userBid = response.data.userbid;

					if (vm.userBid != '') {
						vm.bidNow = false;
						vm.bidNowForm = false;
					}

					vm.daysCount = vm.getDays(vm.projectDetail.project_created, vm.projectDetail.project_current_date);
					vm.hoursCount = Math.round(vm.getHours(vm.projectDetail.project_created, vm.projectDetail.project_current_date) / 24);

					vm.projectSkills = vm.customSplitString(vm.projectDetail.skill_names);
					console.log('Project Found: ', vm.projectDetail, vm.projectBids, vm.projectSkills, vm.userBid);
				} else {
					toastr.error(response.data.message, "Project");
				}
			});
		}

		function getDays(created, current) {
			var eventdate = moment(created);
			var todaysdate = moment(current);
			return todaysdate.diff(eventdate, 'days');
		}

		function getHours(created, current) {
			var eventdate = moment(created);
			var todaysdate = moment(current);
			return todaysdate.diff(eventdate, 'hours');
		}

		function customSplitString(skills) {
			var arr = new Array();
			if (skills != '' && skills != null && skills != undefined) {
				arr = skills.split(',');
			}

			var flag = 0;
			angular.forEach(arr, function (value, key) {
				if (arr.indexOf(value) !== -1) {
					flag++;
					//console.log(value + ' already exists!');
				}
			});

			if (flag == 0) {
				vm.projectSkillsPercentage = 0;
			} else {
				var calculatePercentage = (flag / arr.length) * 100;
				vm.projectSkillsPercentage = vm.getRange(Math.round(calculatePercentage));
			}

			return arr;
		}

		function getRange(percentage) {
			if (percentage <= 100 && percentage >= 90) {
				return 100;
			} else if (percentage <= 90 && percentage > 80) {
				return 90;
			} else if (percentage <= 80 && percentage > 70) {
				return 80;
			} else if (percentage <= 70 && percentage > 60) {
				return 70;
			} else if (percentage <= 60 && percentage > 50) {
				return 60;
			} else if (percentage <= 50 && percentage > 40) {
				return 50;
			} else if (percentage <= 40 && percentage > 30) {
				return 40;
			} else if (percentage <= 30 && percentage > 20) {
				return 30;
			} else if (percentage <= 20 && percentage > 10) {
				return 20;
			} else if (percentage <= 10 && percentage > 0) {
				return 10;
			}
		}

		/* Open Report Abuse popup */
		function openReportAbuseModal(project) {
			vm.success = false;
			vm.reportInfo = {};
			vm.getAllReasons();
			$scope.addReportAbuseModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/project/report-abuse-popup.html',
				scope: $scope
			});
			vm.reportInfo.project_name = project.project_name;
			vm.reportInfo.project_id = project.project_id;
		}

		function reportAbuse(reportInfo) {
			projectService.reportAbuse(reportInfo).then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						vm.success = true;
						var myInterval = $interval(function () {
							$scope.addReportAbuseModal.close();
						}, 2000, 1).then(function () {
							$interval.cancel(myInterval);
						});
					} else {
						toastr.error(response.data.message, "Violation Report");
					}
				}
				// }).catch(function (response) {
				//     toastr.error(response.data.message, "Violation Report");
			});
		}

		function getAllReasons() {
			projectService.getAllReasons().then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						vm.allReasons = response.data.reasons;
					}
				}
			}).catch(function (response) {
				toastr.error(response.data.message, "Violation Reasons");
			});
		}

		function bidonthis() {
			vm.bidNow = false;
		}

		function addTasks() {
			var newItemNo = vm.choices.length + 1;
			vm.choices.push({
				'id': 'choice' + newItemNo
			});
		}

		function removeTask() {
			var lastItem = vm.choices.length - 1;
			vm.choices.splice(lastItem);
		}

		function createBid(proposalForm) {
			proposalForm.project_id = vm.projectDetail.project_id;
			projectService.createBid(proposalForm).then(function (response) {
				if (response.status == 200) {
					toastr.success(response.data.message, "Make a Pitch");
					vm.bidNow = false;
					vm.bidNowForm = false;
					$scope.proposalForm.reset();
					vm.getProjectBids(vm.project_slug);
				} else {
					toastr.error(response.data.message, "Make a Pitch");
				}
			});
		}

		function getProjectBids(project_slug) {
			projectService.singleProject(project_slug).then(function (response) {
				if (response.status == 200) {
					vm.projectBids = response.data.bids;
					vm.userBid = response.data.userbid;

					if (vm.userBid != '') {
						vm.bidNow = false;
						vm.bidNowForm = false;
					}
				} else {
					toastr.error(response.data.message, "Project");
				}
			});
		}

	};

}());