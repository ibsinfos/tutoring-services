(function () {
	"use strict";
	angular.module('employerApp')
		.controller('EmployerController', EmployerController);

	EmployerController.$inject = ['$scope', '$rootScope', '$state', '$location', 'employerService', 'toastr', '$uibModal', '$timeout']

	function EmployerController($scope, $rootScope, $state, $location, employerService, toastr, $uibModal, $timeout) {

		var vm = this;
		vm.init = init;
		vm.getCategories = getCategories;
		vm.getBudgets = getBudgets;
		vm.getUrgency = getUrgency;
		vm.saveProject = saveProject;
		vm.projectForm = {};
		vm.getSkills = getSkills;
		vm.getCheckedSkills = getCheckedSkills;
		vm.stepSkills = stepSkills;
		vm.addPrinciple = addPrinciple;
		vm.removePrinciple = removePrinciple;
		vm.originalCategoriesCount = 0;
		vm.categories = {};
		vm.selectedCategories = [];
		vm.selectedSkills = [];
		vm.skills = {};
		vm.flagAddPrinciple = true;
		vm.choices = [{
			id: 'choice1'
		}];
		vm.projectForm.userId = $rootScope.user.id;
		vm.getProjects = getProjects;
		vm.openTasksModal = openTasksModal;
		vm.getTasks = getTasks;
		vm.addTask = addTask;
		vm.selectTask = selectTask;
		vm.editTask = editTask;
		vm.deleteTasks = deleteTasks;
		$scope.selectedTask = [];
		vm.editFlag = false;
		vm.openEditProjectModal = openEditProjectModal;
		vm.getBiddedProjects = getBiddedProjects;
		vm.customSplitString = customSplitString;
		vm.getRange = getRange;
		vm.hideThisBid = hideThisBid;
		vm.projectSkills = [];
		vm.projectSkillsPercentage = [];
		vm.openDeclineOfferModal = openDeclineOfferModal;
		vm.declineThisOffer = declineThisOffer;
		vm.openTalkToBidderModal = openTalkToBidderModal;
		vm.talkToBidder = talkToBidder;
		vm.openHireBidderModal = openHireBidderModal;
		vm.openAddFileComplaintModal = openAddFileComplaintModal;
		vm.fileComplaint = fileComplaint;
		vm.complaint = {};
		vm.openReleasePaymentModal = openReleasePaymentModal;

		/* runs function on module load */
		function init() {
			vm.getCategories(0);
			vm.getUrgency();
			vm.getProjects();
		}

		/* to get all categories */
		function getCategories(key) {
			vm.categories[key] = [];
			employerService.getCategories().then(function (response) {
				if (response.status == 200) {
					if (response.data.categories && response.data.categories.length > 0) {
						vm.primaryCat = response.data.categories;
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
					vm.projectForm.category[key] = oldValue;
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
				employerService.getSkills(category.id).then(function (response) {
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

			if (active) {
				addSkillToArray(obj);
			} else {
				removeSkillFromArray(obj)
			}
		}//END getCheckedSkills()

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

		function stepSkills(projectForm) {
			if (checkSkillInArray()) {
				$scope.btnSkills = 'next';
			} else {
				toastr.error("Please select any Principle with Skills", "Skills");
			}
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
			if (budgetType != undefined) {
				employerService.getBudgets(budgetType).then(function (response) {
					if (response.status == 200) {
						if (response.data.budget.length > 0) {
							vm.budgets = response.data.budget;
							vm.budgetRange = [];
							angular.forEach(vm.budgets, function (value, key) {
								vm.budgetRange.push({
									'id': value.id,
									'range': value.symbol + value.range_from + " - " + value.symbol + value.range_to,
								});
							});
						} else {
							vm.budgetRange = [];
						}
					} else {
						vm.budgetRange = [];
					}
				}, function (error) {
					vm.budgetRange = [];
					toastr.error(error.data.error, 'Error');
				});
			} else {
				toastr.error('Please select a budget type', 'Error');
			}
		}//END getBudgets()	   

		/* to get ugency */
		function getUrgency() {
			employerService.getUrgency().then(function (response) {
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
				toastr.error(error.data.error, 'Error');
			});
		} //END getUrgency() 

		$scope.uploadFiles = function (files, errFiles) {
			$scope.files = files;
			$scope.errFiles = errFiles;
			vm.specificationFiles = [];
			angular.forEach(files, function (file) {
				vm.specificationFiles.push(file);
			});
			vm.projectForm.files = vm.specificationFiles;
		}

		/* to save a new project */
		function saveProject() {
			vm.projectForm.skills = vm.selectedSkills;
			employerService.saveProject(vm.projectForm).then(function (response) {
				if (response.status == 200) {
					toastr.success(response.data.message, 'Success');
					getProjects();
				}
			}, function (error) {
				toastr.error(error.data.error, 'Error');
			});
		}//END saveProject()

		/* to get all projects */
		function getProjects() {
			employerService.getProjects().then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						var data = response.data.project_data.project;
						if (data && data.length > 0) {
							vm.projects = response.data.project_data.project;
						}
					}
				}
			}, function (error) {
				toastr.error(error.data.error, 'Error');
			});
		}//END getProjects()

		/* to get all tasks */
		function getTasks(projectId) {
			if (projectId != undefined) {
				employerService.getTasks(projectId).then(function (response) {
					if (response.status == 200) {
						if (response.data.tasks && response.data.tasks.length > 0) {
							vm.tasks = response.data.tasks;
						} else {
							vm.tasks = false;
						}
					}
				}, function (error) {
					toastr.error(error.data.error, 'Error');
				});
			} else {
				toastr.error('No project selected !', 'Error');
			}
		}//END getTasks()

		/* open add modal box for tasks */
		function openTasksModal(projectId) {
			vm.taskForm = {};
			vm.projectId = projectId;
			$scope.addTaskModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/project-tasks-popup.html',
				scope: $scope
			});
			getTasks(projectId);
		}//END openTasksModal()

		/* to save a new task */
		function addTask() {
			vm.taskForm.projectId = vm.projectId;
			employerService.addTask(vm.taskForm).then(function (response) {
				if (response.status == 200) {
					toastr.success(response.data.message, 'Success');
					if (vm.editFlag) {
						$('#task-' + vm.taskForm.taskId).effect('highlight', {}, 3000);
						vm.editFlag = false;
						vm.taskForm = {};
						setTimeout(function () {
							getTasks(vm.projectId);
						}, 1000);
					} else {
						getTasks(vm.projectId);
					}
					getProjects();
				}
			}, function (error) {
				toastr.error(error.data.error, 'Error');
			});
		}//END addTask()


		function selectTask(id) {
			var indexOfTask = $scope.selectedTask.indexOf(id);
			if (indexOfTask === -1) {
				$scope.selectedTask.push(id);
			} else {
				$scope.selectedTask.splice(indexOfTask, 1);
			}
		}

		/* to edit a task */
		function editTask(taskId) {
			if (taskId != undefined) {
				vm.editFlag = true;
				employerService.getTask(taskId).then(function (response) {
					if (response.status == 200) {
						vm.taskForm.name = response.data.task.name;
						vm.taskForm.taskId = response.data.task.id;
					}
				}, function (error) {
					toastr.error(error.data.error, 'Error');
				});
			} else {
				vm.editFlag = false;
				toastr.error('Please select a task', 'Error');
			}
		}//END editTask()

		/* to delete multiple tasks */
		function deleteTasks() {
			if ($scope.selectedTask.length > 0) {
				employerService.deleteTasks($scope.selectedTask).then(function (response) {
					if (response.status == 200) {
						toastr.success(response.data.message, 'Success');
						getTasks(vm.projectId);
						getProjects();
					}
				}, function (error) {
					toastr.error(error.data.error, 'Error');
				});
			} else {
				toastr.error('Please select a task', 'Error');
			}
		}//END deleteTasks()

		/* open edit project modal box */
		function openEditProjectModal(projectId) {
			vm.projectId = projectId;
			$scope.addTaskModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/edit-project-popup.html',
				scope: $scope
			});
			getProjectDetails(projectId);
		}//END openEditProjectModal()

		/* to get project information */
		function getProjectDetails(projectId) {
			if (projectId != undefined) {
				employerService.getProjectDetails(projectId).then(function (response) {
					if (response.status == 200) {
						vm.projectForm.name = response.data.project.name;
						vm.projectForm.description = response.data.project.description;
						vm.projectForm.primaryCat = response.data.project.category_id;
						vm.projectForm.budgetType = response.data.project.type;
						getBudgets(vm.projectForm.budgetType);
						vm.projectForm.budget = response.data.project.budget;
						vm.projectForm.urgency = response.data.project.urgency;

						var skill_result = _.chain(response.data.skills).groupBy("category_id").map(function (v, i) {
							return {
								name: i,
								age: _.get(_.find(v, 'category_id'), 'category_id'),
								skills: _.map(v, 'project_skill_id')
							}
						}).value();
					}
				}, function (error) {
					toastr.error(error.data.error, 'Error');
				});
			} else {
				toastr.error('Please select a project', 'Error');
			}
		}

		function getBiddedProjects() {
			employerService.getBiddedProjects().then(function (response) {
				if (response.status == 200) {
					//console.log(response.data.projects);
					vm.biddedProjects = response.data.projects;
				}
			}, function (error) {
				toastr.error(error.data.error, 'Error');
			});
		}

		function customSplitString(skills, bidder_id, prolancer_skills) {
			var arr = new Array();
			if (skills != '' && skills != null && skills != undefined) {
				arr = skills.split(',');
			}

			var prolancerSkillsArray = new Array();
			if (prolancer_skills != '' && prolancer_skills != null && prolancer_skills != undefined) {
				prolancerSkillsArray = prolancer_skills.split(',');
			}

			var flag = 0;
			if (prolancerSkillsArray.length > 0) {
				angular.forEach(prolancerSkillsArray, function (value, key) {
					if (arr.indexOf(value) !== -1) {
						flag++;
					}
				});
			}

			if (flag == 0) {
				vm.projectSkillsPercentage[bidder_id] = 0;
			} else {
				var calculatePercentage = (flag / arr.length) * 100;
				vm.projectSkillsPercentage[bidder_id] = vm.getRange(Math.round(calculatePercentage));
			}

			vm.projectSkills[bidder_id] = arr;
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

		function hideThisBid(bidder_id, event) {
			employerService.hideThisBid(bidder_id).then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						angular.element(event.target).parent().remove();
						toastr.success(response.data.message, 'Bid Hidden');
					} else {
						toastr.error(response.data.message, 'Bid Hidden');
					}
				}
			}, function (error) {
				toastr.error(error.data.error, 'Error');
			});
		}

		/* decline offer */
		function openDeclineOfferModal(singleProject) {
			vm.singleProject = singleProject;
			$scope.declineOfferModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/decline-offer.html',
				scope: $scope,
				closeOnEscape: true
			});
		} //END openDeclineOfferModal()

		function declineThisOffer() {
			//console.log('declineThisOffer', vm.singleProject);
			employerService.declineBid(vm.singleProject.bidder_id).then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						toastr.success(response.data.message, 'Decline Project');
						$scope.declineOfferModal.close();
					} else {
						toastr.error(response.data.message, 'Decline Project');
					}
				}
			}, function (error) {
				toastr.error(error.data.error, 'Decline Project');
			});
		}

		/* talk to bidder */
		function openTalkToBidderModal(singleProject, status) {
			vm.messageForBidder = '';
			if (status == true) {
				singleProject.first_name = singleProject.freelancer_firstname;
				singleProject.last_name = singleProject.freelancer_lastname;
				singleProject.bidder_id = singleProject.freelancer_id;
			}
			vm.singleProject = singleProject;
			$scope.talkToBidderModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/talk-to-bidder.html',
				scope: $scope,
				closeOnEscape: true
			});
		} //END openTalkToBidderModal()

		function talkToBidder() {
			//console.log('talkToBidder', vm.singleProject, vm.messageForBidder);		
			employerService.talkToBidder(vm.singleProject.bidder_id, vm.messageForBidder).then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						toastr.success(response.data.message, 'Talk to Bidder');
						sendAnEmail.reset();
					} else {
						toastr.error(response.data.message, 'Talk to Bidder');
					}
				}
			}, function (error) {
				toastr.error(error.data.error, 'Talk to Bidder');
			});
		}

		/* hire bidder */
		function openHireBidderModal(singleProject) {
			vm.singleProject = singleProject;
			$scope.hireBidderModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/hire-bidder.html',
				scope: $scope,
				closeOnEscape: true,
				size: 'lg'
			});
		} //END openHireBidderModal()		

		vm.init();


		/* file a complaint by employer */
		function openAddFileComplaintModal(reference_number, project_id) {
			vm.complaint = {
				'reference_number': reference_number,
				'project_id': project_id,
				'message': ''
			};

			$scope.addFileComplaintModal = $uibModal.open({
				animation: true,
				backdrop: false,
				windowClass: 'overlay',
				templateUrl: 'app/components/employer/file-complaint.html',
				scope: $scope,
				closeOnEscape: true
			});
		} //END openAddFileComplaintModal()

		function fileComplaint() {
			employerService.fileComplaint(vm.complaint).then(function (response) {
				if (response.status == 200) {
					if (response.data.status == 1) {
						toastr.success(response.data.message, 'File a Complaint');
						$scope.addFileComplaintModal.close();
					} else {
						toastr.error(response.data.message, 'File a Complaint');
					}
				}
			}, function (error) {
				toastr.error(error.data.error, 'File a Complaint');
			});
		}

		/* release stage payment - weekly */
		function openReleasePaymentModal(project, payment_type) {
			vm.release = project;

			if (payment_type == 1) {
				// Weekly

				$scope.releasePaymentModal = $uibModal.open({
					animation: true,
					backdrop: false,
					windowClass: 'overlay',
					templateUrl: 'app/components/employer/release-payment-weekly.html',
					scope: $scope,
					closeOnEscape: true
				});
			} else {
				// Complete

				$scope.releasePaymentModal = $uibModal.open({
					animation: true,
					backdrop: false,
					windowClass: 'overlay',
					templateUrl: 'app/components/employer/release-payment-complete.html',
					scope: $scope,
					closeOnEscape: true
				});
			}
		} //END openReleasePaymentModal()		

	};

}());