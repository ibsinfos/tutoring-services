<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_subjects");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Subject extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('subjectmodel');
        $this->load->helper('common_helper');
    }

    /* to save subject data */
    public function save_post() {
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        $this->form_validation->set_rules('parent_category_id', 'Category', 'trim|numeric|xss_clean|required');

        if ($this->form_validation->run() == FALSE) {
            $array = array('name','parent_category_id');
            $myValid = checkValidation($array);
            http_response_code(401);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $data = array( 
                'name' => $this->post('name'),
                'parent_category_id' => $this->post('parent_category_id'),                
            );
            if($this->post('subject_id')){
                $subjectId = $this->post('subject_id');
                
                $result = $this->subjectmodel->update_subject($data,$subjectId);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Subject updated successfully!');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            } else {
                $data['created_at'] = date('Y-m-d H:i:s');
                $result = $this->subjectmodel->create_subject($data);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Subject created successfully');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            }
        }

        echo json_encode($response); 
        exit();
    }//END save()

    /* to get list of all subjects */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'parent_cat' => $this->get('parent_cat'),
            'sub_cat' => $this->get('sub_cat'),
            'created_at' => $this->get('created_at'),
            'status' => $this->get('status') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->subjectmodel->get_all_subjects($data,1);
        if ($result) {
            $count = $this->subjectmodel->get_all_subjects($data,0);
            $response = array('status' => 1, 'subjects' => $result);
            header('total_subjects:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

    /* to delete a subject */
    public function delete_post(){
        $subjectId = $this->post('subject_id');
        if ($subjectId) {
            $result = $this->subjectmodel->delete_subject($subjectId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Subject deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete()

    /* get subject data for a id */
    public function subjectInfo_get() {
        $subjectId = $this->uri->segment(2);
        if ($subjectId) {
            $subject = $this->subjectmodel->get_subject($subjectId);
            if ($subject) {
                http_response_code(200);
                $response = array('status' => 1, 'subject' => $subject);
            } else {
                http_response_code(401);
                $response = array('status' => 0, 'error' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'No record found!!');
        }
        echo json_encode($response);
        exit();
    }//END subjectInfo()

    /* change active/inactive status of subject */
    public function changeStatus_post() {
        $subjectId = $this->post('subject_id');
        if ($subjectId) {
            $status = $this->post('status');
            $result = $this->subjectmodel->change_status($subjectId, $status);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Status updated successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END changeStatus()

    public function frontGetSubjects_post() {

        $categoryId = $this->post('category_id');
        if ($categoryId) {
            $result = $this->subjectmodel->front_get_subjects($categoryId);
            http_response_code(200);
            if ($result) {                
                $response = array('status' => 1, 'message' => 'Subjects found!', 'subjects' => $result);
            } else {
                $response = array('status' => 0, 'message' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'message' => 'Category Id required!');
        }        
        echo json_encode($response);
        exit();
    }

    public function frontSearchSubjects_get() {
        $name = $this->get('name');
        if (!empty($name)) {
            $result = $this->subjectmodel->front_search_subjects($name);
            http_response_code(200);
            if ($result) {                
                $response = array('status' => 1, 'message' => 'Subjects found!', 'subjects' => $result);
            } else {
                $response = array('status' => 0, 'message' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'message' => 'Subject Name is required!');
        }      
          
        echo json_encode($response);
        exit();
    }
}

?>
