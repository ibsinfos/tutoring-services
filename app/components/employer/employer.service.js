(function () {
    "use strict";
    angular
        .module('employerApp')
        .service('employerService', employerService);

    employerService.$inject = ['$http', 'APPCONFIG', '$q', 'authServices'];

    function employerService($http, APPCONFIG, $q, authServices) {
        var self = this;
        self.getCategories = getCategories;
        self.getBudgets = getBudgets;
        self.getUrgency = getUrgency;
        self.getSkills = getSkills;
        self.saveProject = saveProject;
        self.getProjects = getProjects;
        self.getTasks = getTasks;
        self.addTask = addTask;
        self.deleteTasks = deleteTasks;
        self.getTask = getTask;
        self.getProjectDetails = getProjectDetails;
        self.getBiddedProjects = getBiddedProjects;
        self.hideThisBid = hideThisBid;
        self.declineBid = declineBid;
        self.talkToBidder = talkToBidder;
        self.fileComplaint = fileComplaint;

        /* to get categories */
        function getCategories() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-categories';
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getCategories();

        /* to get budgets */
        function getBudgets(type) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-budget-range?type=' + type;
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getBudgets();

        /* to get urgency */
        function getUrgency() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-urgency';
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getUrgency();

        /* get skills */
        function getSkills(category_id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-skills';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("category_id", category_id);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END getSkills();

        /* save project */
        function saveProject(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-project-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.description = (obj.description === undefined) ? '' : obj.description;
                    obj.primaryCat = (obj.primaryCat === undefined) ? '' : obj.primaryCat;
                    obj.budget = (obj.budget === undefined) ? '' : obj.budget;
                    obj.urgency = (obj.urgency === undefined) ? '' : obj.urgency;
                    obj.skills = (obj.skills === undefined) ? '' : obj.skills;
                    obj.budgetType = (obj.budgetType === undefined) ? '' : obj.budgetType;

                    formData.append("name", obj.name);
                    formData.append("description", obj.description);
                    formData.append("category", obj.primaryCat);
                    formData.append("budget", obj.budget);
                    formData.append("urgency", obj.urgency);
                    formData.append("skills", JSON.stringify(obj.skills));
                    formData.append("user_id", obj.userId);
                    angular.forEach(obj.files, function (value, key) {
                        formData.append("files[]", obj.files[key]);
                    });
                    formData.append("type", obj.budgetType);

                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        } //END saveProject();

        /* to get projects */
        function getProjects() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-projects';
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getProjects();

        /* to get tasks */
        function getTasks(projectId) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-tasks?project_id=' + projectId;
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getTasks();

        /* to create new task */
        function addTask(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-task-save';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    obj.name = (obj.name === undefined) ? '' : obj.name;
                    obj.projectId = (obj.projectId === undefined) ? '' : obj.projectId;
                    if (obj.taskId != undefined && obj.taskId != '') {
                        formData.append("task_id", obj.taskId);
                    }
                    formData.append("name", obj.name);
                    formData.append("project_id", obj.projectId);

                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END addTask()

        /* to delete tasks */
        function deleteTasks(obj, projectId) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-task-delete';
            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("tasks", JSON.stringify(obj));
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END addTask()

        /* to get task */
        function getTask(taskId) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-task?id=' + taskId;
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getTask();

        /* to get project details */
        function getProjectDetails(id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-get-project-info?id=' + id;
            $http({
                method: 'GET',
                url: URL,
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }//END getProjectDetails();

        function getBiddedProjects() {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-employer-bidded-projects';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function hideThisBid(bidder_id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-employer-hide-bid';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("bidder_id", bidder_id);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function declineBid(bidder_id) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-employer-decline-bid';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("bidder_id", bidder_id);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function talkToBidder(bidder_id, message) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-employer-talk-to-bidder';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("bidder_id", bidder_id);
                    formData.append("message", message);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function fileComplaint(obj) {
            var deferred = $q.defer();
            var URL = APPCONFIG.APIURL + 'front-employer-file-complaint';

            $http({
                method: 'POST',
                url: URL,
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("token", authServices.getAuthToken());
                    formData.append("reference_number", obj.reference_number);
                    formData.append("project_id", obj.project_id);
                    formData.append("message", obj.message);
                    formData.append("type", 2);
                    return formData;
                },
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        return self;

    };//END employerService()
}());
