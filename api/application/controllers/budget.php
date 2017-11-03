<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_categories");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Budget extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('budgetmodel');
        $this->load->helper('common_helper');
        // if (!$this->input->is_ajax_request()) {
        //    exit('No direct script access allowed');
        // }
    }

    /* to save budget data */
    public function save_post() {
        $this->form_validation->set_rules('currency_id', 'Currency', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        $this->form_validation->set_rules('range_from', 'Range', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('range_to', 'Range', 'trim|numeric|xss_clean|required');
        if ($this->form_validation->run() == FALSE) {
            $array = array('name','range_from','range_to');
            $myValid = checkValidation($array);
            http_response_code(401);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            if($this->post('range_to') < $this->post('range_from')) {
                http_response_code(401);
                $response = array('status' => 0, 'error' => 'Range from cannot be greater range to.');
            } else {
                $data = array( 
                    'currency_id' => $this->post('currency_id'),
                    'name' => $this->post('name'),
                    'range_from' => $this->post('range_from'),
                    'range_to' => $this->post('range_to'),
                    'type' => $this->post('type')
                );
                if($this->post('budget_id')){
                    $budgetId = $this->post('budget_id');
                    $result = $this->budgetmodel->update_budget($data,$budgetId);
                    if ($result) {
                        $response = array('status' => 1, 'message' => 'Budget updated successfully!');
                    } else {
                        http_response_code(401);
                        $response = array('status' => 0, 'error' => 'Something went wrong!');
                    }
                } else {
                    $data['created_at'] = date('Y-m-d H:i:s');
                    $result = $this->budgetmodel->create_budget($data);
                    if ($result) {
                        $response = array('status' => 1, 'message' => 'Budget created successfully');
                    } else {
                        http_response_code(401);
                        $response = array('status' => 0, 'error' => 'Something went wrong!');
                    }
                }
            }
        }
        echo json_encode($response); 
        exit();
    }//END save()

    /* to get list of all budgets */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'created_at' => $this->get('created_at'),
            'status' => $this->get('status') * 1,
            'type' => $this->get('type') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->budgetmodel->get_all_budgets($data,1);
        if ($result) {
            $count = $this->budgetmodel->get_all_budgets($data,0);
            $response = array('status' => 1, 'budgets' => $result);
            header('total_categories:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

    public function show_get(){
        # code...
    }//END show()

    /* to delete a budget */
    public function delete_post(){
        $budgetId = $this->post('budget_id');
        if ($budgetId) {
            $result = $this->budgetmodel->delete_budget($budgetId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Budget deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete()

    /* get active currency */
    public function activeCurrency_get() {
        $result = getActiveCurrency();
        if ($result) {
            $response = array('status' => 1, 'activeCurrency' => $result);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END activeCurrency()

    /* get budget information for a id */
    public function budgetInfo_get() {
        $budgetId = $this->uri->segment(2);
        if ($budgetId) {
            $budget = $this->budgetmodel->get_budget($budgetId);
            if ($budget) {
                http_response_code(200);
                $response = array('status' => 1, 'budget' => $budget);
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
    }//END budgetInfo()

    /* change active/inactive status of budget */
    public function changeStatus_post() {
        $budgetId = $this->post('budget_id');
        if ($budgetId) {
            $status = $this->post('status');
            $result = $this->budgetmodel->change_status($budgetId, $status);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Budget updated successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END changeStatus()

    /* get budget range */
    public function budgetRange_get() {
        $type = $this->get('type');
        if($type) {
            $budget = $this->budgetmodel->get_budget_range($type);
            if ($budget) {
                http_response_code(200);
                $response = array('status' => 1, 'budget' => $budget);
            } else {
                http_response_code(401);
                $response = array('status' => 0, 'error' => 'No budgets for this type');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Please select a budget type');
        }
        echo json_encode($response);
        exit();
    }//END budgetRange()

}

?>
