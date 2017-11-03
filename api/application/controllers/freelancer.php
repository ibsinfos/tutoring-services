<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_categories");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Freelancer extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->helper('common_helper');
        $this->load->model('freelancermodel');
        $this->load->model('authmodel');
        $this->load->model('abusemodel');
        $this->load->model('reasonmodel');
    } 

    function updateBankDetails_post() {
        $this->form_validation->set_rules('bank_name', 'Your Bank Name', 'required');
        $this->form_validation->set_rules('bank_code', 'Your branch sort code', 'trim|required');
        $this->form_validation->set_rules('bank_account_number', 'Your account number', 'trim|required');
        $this->form_validation->set_rules('bank_iban', 'Bank IBAN', 'trim|required');
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('user_id', 'bank_name', 'bank_code', 'bank_account_number','bank_iban');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                                
                $data['bank_name'] = $this->post('bank_name');
                $data['bank_code'] = $this->post('bank_code');
                $data['bank_account_number'] = $this->post('bank_account_number');
                $data['bank_iban'] = $this->post('bank_iban');

                $updateBankDetails = $this->freelancermodel->updateBankDetails($data, $user_id);
                if ($updateBankDetails) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'Bank details updated successfully!');                    
                } else {
                    http_response_code(200);
                    $response_array = array('status' => 0, 'message' => 'Bank details update failed!');
                }
            }else{
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        
        echo json_encode($response_array);
    }

    function getBankDetails_post() {
        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';            

            $getBankDetails = $this->freelancermodel->getBankDetails($user_id);
            if ($getBankDetails) {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'Bank details found!', 'details' => $getBankDetails);                    
            } else {
                http_response_code(200);
                $response_array = array('status' => 0, 'message' => 'No Bank details found!');
            }
        }else{
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }
        
        echo json_encode($response_array);
    }

    function updateUserDetails_post() {
        $this->form_validation->set_rules('firstname', 'First Name', 'trim|required');
        $this->form_validation->set_rules('lastname', 'Last Name', 'trim|required');
        $this->form_validation->set_rules('headline', 'Prefessional Headline', 'trim|required');
        $this->form_validation->set_rules('bio', 'About Yourself', 'trim|required');
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('firstname', 'lastname', 'headline', 'bio');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $data['firstname'] = $this->post('firstname');
                $data['lastname'] = $this->post('lastname');
                $data['headline'] = $this->post('headline');
                $data['bio'] = $this->post('bio');
                if(!empty($this->post('hourly_rate'))) {
                    $data['hourly_rate'] = $this->post('hourly_rate');
                }

                $updateProfile = $this->authmodel->update_profile($data, $user_id);
                if ($updateProfile) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'Profile updated successfully!');
                } else {
                    http_response_code(200);
                    $response_array = array('status' => 0, 'message' => 'Profile update failed!');
                }
            }else{
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }

    function updateUserPhoto_post() {

        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';
                        
            if (isset($_FILES['photo']['name']) && $_FILES['photo']['name'] != '') {
                $field_name = 'photo';
                $upload_path = USER_PATH . $user_id . '/avatar/';
                $upload_thumb_path = USER_PATH . $user_id . '/avatar/thumbs/';
    
                if (!is_dir($upload_path)) {
                    mkdir($upload_path, 0777, TRUE);
                    chmod(getcwd() . $upload_path, 0777); // CHMOD file
                }

                if (!is_dir($upload_thumb_path)) {
                    mkdir($upload_thumb_path, 0777, TRUE);
                    chmod(getcwd() . $upload_thumb_path, 0777); // CHMOD file
                }
    
                $upload = uploadFile($field_name, array("upload_path" => $upload_path, "max_size" => '2048'));

                //create thumbnail
                $resize_width = 200;
                $resize_height = 200;
                resize_image($upload_path . $upload['file'], $resize_width, $resize_height, $upload_thumb_path);
    
                if ($upload["result"] === "success") {
                    $data['profile_image'] = $upload["file"];
                    
                    $updateUserPhoto = $this->freelancermodel->update_user_photo($data, $user_id);
                    if ($updateUserPhoto) {
                        http_response_code(200);
                        $response_array = array('status' => 1, 'message' => 'Profile Photo Updated successfully!');
                    } else {
                        http_response_code(401);
                        $response_array = array('status' => 0, 'error' => 'Unable to update profile photo. Please try again later!');
                    }
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => $upload["msg"]);
                }
            }
        } else {
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }           
        
        echo json_encode($response_array);
    }


    function updateUserSkills_post() {
        
        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';

            $skills = $this->post('skills');
            $skills = json_decode($skills);

            $updateUserSkills = $this->freelancermodel->update_user_skills($skills, $user_id);
            if ($updateUserSkills) {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'Skills updated successfully!');
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'error' => 'Unable to update skills. Please try again later!');
            }            
        } else {
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }           
        
        echo json_encode($response_array);
    }

    /* get default percentage */
    public function defaultPercentage_get() {
        $result =  $this->freelancermodel->get_default_percentage();
        http_response_code(401);
        if($result) {
            http_response_code(200);
            $response = array('status' => 1, 'percentage' => $result);
        } else {
            $response = array('status' => 0, 'message' => 'Internal server error.');
        }
        echo json_encode($response);
        exit();
    }//END defaultPercentage()

    /* to search projects */
    public function searchProjects_post() {
        // echo "<pre>";
        // print_r($_POST);
        // $freelancerSkillCount = $this->post('skill_count');
        // $percentage = $this->post('percentage');
        // if(isset($percentage) && $percentage != '') {
        //     $skillsToMatch = ceil(($freelancerSkillCount * $percentage) / 100);
        //     echo $skillsToMatch;
        // }

        // SELECT * FROM `pro_project_skills` as pskill LEFT JOIN pro_users_skills as uskill ON pskill.skill_id = uskill.skill_id WHERE uskill.user_id = 3 AND uskill.is_deleted = 0 GROUP BY uskill.skill_id

        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';

            $searchCategory = $this->post('category');
            $searchBudgetType = $this->post('budgetType');
            $searchBudget = $this->post('budget');
            $searchUrgency = $this->post('urgency');
            $searchSkillsMatch = $this->post('skillsmatch');
            $searchData = array(
                'category' => $searchCategory,
                'budgetType' => $searchBudgetType,
                'budget' => $searchBudget,
                'urgency' => $searchUrgency,
                'skillsmatch' => $searchSkillsMatch,
            );

            $searchProjects = $this->freelancermodel->search_projects($searchData, $user_id);
            if ($searchProjects) {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'Projects Found!', 'projects' => $searchProjects);
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Projects not Found!');
            }            
        } else {
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }           
        
        echo json_encode($response_array);
    }

    /* to get single project */
    public function singleProject_post() {
        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';

            $project_slug = $this->post('project_slug');

            $getProject = $this->freelancermodel->get_single_project($project_slug);
            if ($getProject) {
                http_response_code(200);
                $this->load->model('bidsmodel');
                $projectBids = $this->bidsmodel->get_all_bids($getProject['project_id']);
                $userBid = $this->bidsmodel->get_single_bid($getProject['project_id'], $user_id);
                $avgBid = $this->bidsmodel->get_avg_bid($getProject['project_id']);
                $response_array = array('status' => 1, 'message' => 'Project Found!', 'project' => $getProject, 'bids' => $projectBids, 'userbid' => $userBid, 'avgbid' => $avgBid);
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Project not Found!');
            }            
        } else {
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }           
        
        echo json_encode($response_array);
    }

    public function reportAbuse_post() {
        $this->form_validation->set_rules('project_id', 'Project ID', 'trim|required');
        $this->form_validation->set_rules('reason', 'Reason', 'trim|required');
        $this->form_validation->set_rules('comments', 'Comments', 'trim|required');        
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('project_id', 'reason', 'comments');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $data['user_id'] = $user_id;
                $data['project_id'] = $this->post('project_id');
                $data['reason'] = $this->post('reason');
                $data['comments'] = $this->post('comments');

                http_response_code(200);
                $insertReport = $this->abusemodel->insert_report($data);
                if ($insertReport) {
                    $response_array = array('status' => 1, 'message' => 'Thank you for updating us!');
                } else {
                    $response_array = array('status' => 0, 'message' => 'Unable to provide abuse report for this Project!');
                }
            }else{
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }   
    

    public function getAllReasons_get() {
        $allReasons = $this->reasonmodel->front_get_all_reasons();
        if ($allReasons) {
            $response_array = array('status' => 1, 'message' => 'Reasons found', 'reasons' => $allReasons);
        } else {
            $response_array = array('status' => 0, 'message' => 'Unable to provide abuse report for this Project!');
        }

        echo json_encode($response_array);
    }

    public function bidOnProject_post() {
        $this->form_validation->set_rules('project_id', 'Project ID', 'trim|required');
        $this->form_validation->set_rules('bidAmount', 'Bid Amount', 'trim|required');
        $this->form_validation->set_rules('deliveryDays', 'Deliver in Days', 'trim|required');   
        $this->form_validation->set_rules('summary', 'Bid Summary', 'trim|required');   
        $this->form_validation->set_rules('skillsSummary', 'Skills/expertise Summary', 'trim|required');   
        $this->form_validation->set_rules('amount', 'Amount', 'trim|required');   
        $this->form_validation->set_rules('description', 'Description', 'trim|required');   
                     
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('project_id', 'bidAmount', 'deliveryDays', 'summary', 'skillsSummary', 'amount', 'description');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $data['user_id'] = $user_id;
                $data['project_id'] = $this->post('project_id');
                $data['bid_amount'] = $this->post('bidAmount');
                $data['deliver_days'] = $this->post('deliveryDays');
                $data['bid_summary'] = $this->post('summary');
                $data['skills_summary'] = $this->post('skillsSummary');
                $data['question_for_employer'] = $this->post('employerQuestion');

                $milestones['amount'] = json_decode($this->post('amount'), true);
                $milestones['description'] = json_decode($this->post('description'), true);               

                $this->load->model('bidsmodel');

                http_response_code(200);
                $insertBid = $this->bidsmodel->create_bid($data, $milestones);
                if ($insertBid) {
                    $response_array = array('status' => 1, 'message' => 'Congratulations for bidding on this Project!');
                } else {
                    $response_array = array('status' => 0, 'message' => 'Unable to bid on this Project! Please try again later');
                }
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }

    public function viewProfile_post() {
        $this->form_validation->set_rules('slug', 'User Slug', 'trim|required');                     
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('slug');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                                
                $userSlug = $this->post('slug');                
                
                http_response_code(200);
                $viewProfile = $this->freelancermodel->view_profile($userSlug);
                if ($viewProfile) {
                    $response_array = array('status' => 1, 'message' => 'Freelancer Found!', 'profile' => $viewProfile['profile'], 'skills' => $viewProfile['skills']);
                } else {
                    $response_array = array('status' => 0, 'message' => 'No User Found!');
                }
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }    

}

?>
