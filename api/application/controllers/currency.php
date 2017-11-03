<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_categories");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Currency extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('currencymodel');
        $this->load->helper('common_helper');
    }

    /* to change active currency */
    public function changeCurrency_post() {
        if($this->post('currency_id')){
            $currencyId = $this->post('currency_id');
            $result = $this->currencymodel->update_currency($currencyId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Currency updated successfully!');
            } else {
                http_response_code(401);
                $response = array('status' => 0, 'error' => 'Something went wrong!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response); 
        exit();
    }//END changeCurrency()

    /* to get list of all currencies */
    public function list_get(){
        $result = $this->currencymodel->get_all_currencies();
        if ($result) {
            $activeCurrency = getActiveCurrency();
            if($activeCurrency) {
                $response = array('status' => 1, 'currencies' => $result, 'active' => $activeCurrency);
            } else {
                $response = array('status' => 0, 'error' => 'No record found!');    
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

}

?>
