<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_reasons");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Reason extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('reasonmodel');
        $this->load->helper('common_helper');
    }    

    /* to save reason data */
    public function save_post() {
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        
        if ($this->form_validation->run() == FALSE) {
            $array = array('name');
            $myValid = checkValidation($array);
            http_response_code(401);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $data = array( 
                'name' => $this->post('name')                
            );
            if($this->post('reason_id')){
                $reasonId = $this->post('reason_id');
                
                $result = $this->reasonmodel->update_reason($data,$reasonId);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Reason updated successfully!');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            } else {
                $data['created_at'] = date('Y-m-d H:i:s');
                $result = $this->reasonmodel->create_reason($data);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Reason created successfully');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            }
        }
        echo json_encode($response); 
        exit();
    }//END save()

    /* to get list of all reasons */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'created_at' => $this->get('created_at'),
            'status' => $this->get('status') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->reasonmodel->get_all_reasons($data, 1);
        if ($result) {
            $count = $this->reasonmodel->get_all_reasons($data, 0);
            $response = array('status' => 1, 'reasons' => $result);
            header('total_reasons:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }

        echo json_encode($response);
        exit();
    }//END list()

    /* to delete a reason */
    public function delete_post(){
        $reasonId = $this->post('reason_id');
        if ($reasonId) {
            $result = $this->reasonmodel->delete_reason($reasonId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Reason deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete()

    /* get reason data for a id */
    public function reasonInfo_get() {
        $reasonId = $this->uri->segment(2);
        if ($reasonId) {
            $reason = $this->reasonmodel->get_reason($reasonId);
            if ($reason) {
                http_response_code(200);
                $response = array('status' => 1, 'reason' => $reason);
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
    }//END reasonInfo()

    /* change active/inactive status of package */
    public function changeStatus_post() {
        $reasonId = $this->post('reason_id');
        if ($reasonId) {
            $status = $this->post('status');
            $result = $this->reasonmodel->change_status($reasonId, $status);
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

}

?>
