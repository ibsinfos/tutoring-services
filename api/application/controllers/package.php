<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_packages");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Package extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('packagemodel');
        $this->load->helper('common_helper');
    }

    /* to get all default key tags */
    public function keyTags_get() {
        $result = $this->packagemodel->get_all_tags();
        if ($result) {
            $response = array('status' => 1, 'tags' => $result);
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END keyTags()

    /* to save package data */
    public function save_post() {
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        $this->form_validation->set_rules('amount', 'Name', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('description', 'Description', 'trim|xss_clean|required');
        $this->form_validation->set_rules('tags', 'Tags', 'trim|xss_clean|required');
        if ($this->form_validation->run() == FALSE) {
            $array = array('name','description','amount','tags');
            $myValid = checkValidation($array);
            http_response_code(401);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $data = array( 
                'name' => $this->post('name'),
                'amount' => $this->post('amount'),
                'description' => $this->post('description'),
                'key_tags' => $this->post('tags')
            );
            if($this->post('package_id')){
                $packageId = $this->post('package_id');
                
                $result = $this->packagemodel->update_package($data,$packageId);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Package updated successfully!');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            } else {
                $data['created_at'] = date('Y-m-d H:i:s');
                $result = $this->packagemodel->create_package($data);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Package created successfully');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            }
        }
        echo json_encode($response); 
        exit();
    }//END save()

    /* to get list of all packages */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'amount' => $this->get('amount'),
            'created_at' => $this->get('created_at'),
            'status' => $this->get('status') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->packagemodel->get_all_packages($data,1);
        if ($result) {
            $count = $this->packagemodel->get_all_packages($data,0);
            $response = array('status' => 1, 'packages' => $result);
            header('total_packages:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

    /* to delete a package */
    public function delete_post(){
        $packageId = $this->post('package_id');
        if ($packageId) {
            $result = $this->packagemodel->delete_package($packageId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Package deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete()

    /* get package data for a id */
    public function packageInfo_get() {
        $packageId = $this->uri->segment(2);
        if ($packageId) {
            $package = $this->packagemodel->get_package($packageId);
            if ($package) {
                $tag_ids = explode(",",$package["key_tags"]);
                $package["tags"] = $this->packagemodel->get_tags($tag_ids);
                http_response_code(200);
                $response = array('status' => 1, 'package' => $package);
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
    }//END packageInfo()

    /* change active/inactive status of package */
    public function changeStatus_post() {
        $packageId = $this->post('package_id');
        if ($packageId) {
            $status = $this->post('status');
            $result = $this->packagemodel->change_status($packageId, $status);
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
