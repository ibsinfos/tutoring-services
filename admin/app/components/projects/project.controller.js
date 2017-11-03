(function () {
    "use strict";
    angular.module('projectApp')
        .controller('ProjectController', ProjectController);

    ProjectController.$inject = ['$scope', '$state', 'projectService', 'toastr', 'SweetAlert', '$location'];

    function ProjectController($scope, $state, projectService, toastr, SweetAlert, $location) {
        var vm = this;
        vm.init = init;
        vm.getProjectList = getProjectList;
        vm.formatDate = formatDate;
        vm.changePage = changePage;
        vm.sort = sort;
        vm.totalProjects = 0;
        vm.projectsPerPage = 10; // this should match however many results your API puts on one page
        vm.pagination = {
            current: 1
        };
        vm.getProjectInfo = getProjectInfo;
        vm.approve = approve;
        vm.reset = reset;
        vm.deleteProject = deleteProject;

        /* to extract parameters from url */
        var path = $location.path().split("/");
        if (path[2] == "view") {
            if (path[3] == "") {
                $state.go('administrator.projects');
                return false;
            } else {
                getProjectInfo(path[3]);
            }
        }

        /* runs function on module load */
        function init() {}

        /* to format date*/
        function formatDate(date) {
            return moment(date).format("MMMM Do YYYY");
        } //END formatDate()

        /* for sorting project list */
        function sort(keyname) {
            vm.sortKey = keyname; //set the sortKey to the param passed
            vm.reverse = !vm.reverse; //if true make it false and vice versa
        } //END sort()

        /* call when page changes */
        function changePage(newPage, searchInfo) {
            getProjectList(newPage, searchInfo);
        } //END changePage()


        /* to get projects list */
        function getProjectList(newPage, obj) {
            projectService.getProjects(newPage, obj).then(function (response) {
                if (response.status == 200) {
                    if (response.data.projects && response.data.projects.length > 0) {
                        vm.totalProjects = response.headers('total_projects');
                        vm.projectList = response.data.projects;
                    } else {
                        vm.totalProjects = 0;
                        vm.projectList = "";
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getProjectList

        /* to get project information */
        function getProjectInfo(projectId) {
            projectService.getProjectById(projectId).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 1) {
                        vm.editFlag = true;
                        vm.projectDetails = response.data;
                        if (vm.projectDetails.project.approved == 0) {
                            $scope.disabled = false;
                        } else {
                            $scope.disabled = true;
                        }
                        if (vm.projectDetails.files && vm.projectDetails.files.length > 0) {
                            vm.images = [];
                            vm.otherFiles = [];
                            angular.forEach(vm.projectDetails.files, function (value, key) {
                                if (value.type == 'png' || value.type == 'jpg' || value.type == 'gif') {
                                    vm.images.push(value);
                                } else {
                                    vm.otherFiles.push(value);
                                }
                            });
                        }

                        //getAllReports(projectId);
                    }
                }
            }, function (error) {
                toastr.error(error.data.error, 'Error');
            });
        } //END getProjectInfo();

        /* to approve/disapprove project */
        function approve(id) {
            if (id) {
                SweetAlert.swal({
                        title: "Are you sure you want to approve this project?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: true,
                        html: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            projectService.approveProject(id).then(function (response) {
                                if (response.status == 200) {
                                    if (response.data.status == 1) {
                                        $scope.disabled = true;
                                        SweetAlert.swal("Success!", response.data.message, "success");
                                        return true;
                                    }
                                } else {
                                    toastr.error(response.data.error, 'Error');
                                    return false;
                                }
                            }, function (error) {
                                toastr.error(error.data.error, 'Error');
                            });
                        }
                    });
            } else {
                toastr.error('No project id', 'Error');
            }
        } //END changeStatus()        

        /** to delete a project **/
        function deleteProject(id,index) {
            SweetAlert.swal({
               title: "Are you sure you want to delete this project?",
               text: "",
               type: "warning",
               showCancelButton: true,
               confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
               cancelButtonText: "No",
               closeOnConfirm: false,
               closeOnCancel: true,
               html: true
            }, 
            function(isConfirm){ 
                if (isConfirm) {
                    projectService.deleteProject(id).then(function(response) {
                        if (response.data.status == 1) {
                            SweetAlert.swal("Deleted!", response.data.message, "success");
                            vm.projectList.splice(index, 1);
                        }
                    },function (error) {
                        toastr.error(error.data.error, 'Error');
                    });
                }
            });
        }//END deleteProject()

        /* to reset all search parameters in listing */
        function reset() {
            vm.search = [];
            getProjectList(1, '');
        } //END reset()

        vm.init();
    }

}());