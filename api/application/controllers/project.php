<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_projects");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Project extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('projectmodel');
        $this->load->model('employermodel');
        $this->load->model('abusemodel');
        $this->load->helper('common_helper');
    }

    /* to get list of all projects */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'category' => $this->get('category'),
            'created_at' => $this->get('created_at'),
            'status' => $this->get('status') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->projectmodel->get_all_projects($data,1);
        if ($result) {
            $count = $this->projectmodel->get_all_projects($data,0);
            $response = array('status' => 1, 'projects' => $result);
            header('total_projects:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

    /* get project data for a id */
    public function projectInfo_get() {
        $projectId = $this->get('id');
        http_response_code(401);
        if ($projectId) {
            $project = $this->projectmodel->get_project($projectId);
            if ($project) {
                $project_tasks = $this->employermodel->get_tasks($projectId);
                $project_files = $this->projectmodel->get_files($projectId);
                $project_reports = $this->abusemodel->get_reports($projectId);
                $project_skills = $this->projectmodel->get_project_skills($projectId);
                http_response_code(200);
                $response = array('status' => 1, 'project' => $project, 'tasks' => $project_tasks, 'files' => $project_files, 'reports' => $project_reports, 'skills' => $project_skills);
            } else {
                $response = array('status' => 0, 'error' => 'No record found!');
            }
        } else {
            $response = array('status' => 0, 'error' => 'No record found!!');
        }
        echo json_encode($response);
        exit();
    }//END projectInfo()

    /* to approve project */
    public function approve_post() {
        $projectId = $this->post('project_id');
        if ($projectId) {
            $result = $this->projectmodel->approve_project($projectId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Project approved successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END approve()   

    /* to delete a project */
    public function delete_post(){
        $projectId = $this->post('project_id');
        if ($projectId) {
            $result = $this->projectmodel->delete_project($projectId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Project deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete() 

}

?>
