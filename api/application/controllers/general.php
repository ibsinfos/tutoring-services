<?php

defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

require APPPATH . 'libraries/REST_Controller.php';

class General extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->helper('common_helper');
    }

    /* to save review and rating */
    public function saveReviewRating_post(){
        $this->form_validation->set_rules('title', 'Title', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_id', 'Project Id', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('receiver_id', 'Receiver Id', 'trim|numeric|xss_clean|required');
        $this->load->model('projectmodel');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('title', 'project_id', 'receiver_id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                $endDate = $date = date('Y-m-d H:i:s', mktime(0, 0, 0, date('m'), date('d') + 5, date('Y')));
                $data = array(
                    'sender_id' => $user_id,
                    'project_id' => $this->post('project_id'), 
                    'receiver_id' => $this->post('receiver_id'), 
                    'title' => $this->post('title'), 
                    'full_review' => $this->post('full_review'), 
                    'job_quality' => $this->post('job_quality'),
                    'communication' => $this->post('communication'),
                    'availaibility' => $this->post('availaibility'),
                    'time_management' => $this->post('time_management'),
                    'clarity_of_requirements' => $this->post('clarity_of_requirements'),
                    'type' => $this->post('type'),
                    'end_date' => $endDate
                );
                if($this->post('review_id')){
                    $result = $this->projectmodel->update_review_rating($data,$this->post('review_id'));
                    if ($result) {
                        http_response_code(200);
                        $data['id'] = $result;
                        $response = array('status' => 1, 'message' => 'Review and rating updated successfully!', 'last_record' => $data);
                    } else {
                        $response = array('status' => 0, 'error' => 'Something went wrong!');
                    }
                } else {
                    $data['created_at'] = date('Y-m-d H:i:s');
                    $result = $this->projectmodel->insert_review_rating($data);
                    if ($result) {
                        http_response_code(200);
                        $response = array('status' => 1, 'message' => 'Review and rating added successfully');
                    } else {
                        $response = array('status' => 0, 'message' => 'Something went wrong!');
                    }
                }
            } else {
                $response = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        echo json_encode($response);
        exit();
    }//END saveReviewRating()

    /* to get review and ratings */
    public function getReviewRatingsList_post(){
        $this->form_validation->set_rules('id', 'Id', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('type', 'Type', 'trim|numeric|xss_clean|required');
        $this->load->model('projectmodel');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('id','type');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $userId = isset($udata[0]) ? $udata[0] : '';
                if($this->post('id') == $userId) {
                    $result = $this->projectmodel->get_all_review_ratings($userId,$this->post('type'));
                    if ($result) {
                        http_response_code(200);
                        $response = array('status' => 1, 'review_ratings' => $result);
                    } else {
                        http_response_code(200);
                        $response = array('status' => 0, 'message' => 'Review and ratings not Found!');
                    }            
                } else {
                    $response = array('status' => 0, 'message' => 'You are not authorised user!');
                }
            } else {
                $response = array('status' => 0, 'message' => 'You are not authorised user!');
            }      
        }     
        echo json_encode($response);
        exit();
    }//END getReviewRatingsList()

    /* to get review and ratings */
    public function getReviewRatingsInfo_post(){
        $this->form_validation->set_rules('id', 'Id', 'trim|numeric|xss_clean|required');
        $this->load->model('projectmodel');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $result = $this->projectmodel->get_review_ratings($this->post('id'));
                if ($result) {
                    http_response_code(200);
                    $response = array('status' => 1, 'review_ratings' => $result);
                } else {
                    $response = array('status' => 0, 'message' => 'Review and ratings not Found!');
                }            
            } else {
                $response = array('status' => 0, 'message' => 'You are not authorised user!');
            }      
        }     
        echo json_encode($response);
        exit();
    }//END getReviewRatingsInfo()


    public function getOverview_post() {
        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {

            $this->load->model('categorymodel');
            $this->load->model('subjectmodel');

            $countCategory = $this->categorymodel->get_count();
            $countSubject = $this->subjectmodel->get_count();

            http_response_code(200);
            $response = array('status' => 1, 'category' => $countCategory, 'subject' => $countSubject);
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'message' => 'You are not authorised user!');
        }    
        
        echo json_encode($response);
        exit();
    }
}
