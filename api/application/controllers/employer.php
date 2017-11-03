<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_categories");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Employer extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('employermodel');
        $this->load->model('projectmodel');
        $this->load->helper('common_helper');
        $this->load->helper('email_helper');
    }

    /* to save project */
    public function createProject_post() {

        $referenceNumber = $this->projectmodel->get_max_reference_number();
        if(empty($referenceNumber)) {
            $referenceNumber = 10001;
        } else {
            $referenceNumber++;
        }
        

        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        $this->form_validation->set_rules('description', 'Description', 'trim|xss_clean|required');
        $this->form_validation->set_rules('category', 'Category', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('budget', 'Budget', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('urgency', 'Urgency', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('skills', 'Skills', 'trim|xss_clean|required');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('name','description','category','budget','urgency','skills');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            if ($_FILES['files']['error'][0] > 0) {
                http_response_code(401);
                $response_array = array('status' => 0, 'error' => 'Please select a file!');
            } else {
                $userId = $this->post('user_id');

                $config = array(
                    'table' => 'projects',
                    'id' => 'id',
                    'field' => 'slug',
                    'title' => 'title',
                    'replacement' => 'dash' // Either dash or underscore
                );
                $this->load->library('slug', $config);                

                $data = array( 
                    'user_id' => $userId,
                    'name' => $this->post('name'),
                    'description' => $this->post('description'),
                    'category' => $this->post('category'),
                    'budget' => $this->post('budget'),
                    'urgency' => $this->post('urgency'),
                    'type' => $this->post('type'),
                    'reference_number' => $referenceNumber,                    
                    'created_at' => date('Y-m-d H:i:s')
                );
                $data['slug'] = $this->slug->create_uri(array('title' => $this->post('name')));
                $this->db->trans_start();
                $this->db->trans_strict(FALSE);
                $result = $this->employermodel->create_project($data);
                if ($result) {
                    $skills = json_decode($this->input->post('skills'), true);
                    $insertSkill = $this->insertProjectSkills($result,$skills); //to insert project skills
                    $filesArr = array();
                    $files = $this->uploadProjectFiles($_FILES,$userId,$result);
                    if(!empty($files) && $files['status'] == 1) {

                        $insertFiles = $this->insertFiles($result,$files);
                        $this->db->trans_complete();
                        if ($this->db->trans_status() === FALSE) {
                            $this->db->trans_rollback();
                            $response = array('status' => 0, 'error' => 'Something went wrong!');    
                        } else {
                            $this->db->trans_commit();
                            http_response_code(200);
                            $response = array('status' => 1, 'message' => 'Project created successfully');
                        }
                    } else {
                        $response = array('status' => 0, 'error' => 'Something went wrong!');    
                    }
                } else {
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            }
        }
        echo json_encode($response); 
        exit();
    }//END save()

    public function insertProjectSkills($projectId,$skills){
        $skillArr = array();
        foreach ($skills as $skill) {
            $skillArr = array();
            $skillArr['project_id'] = $projectId;
            $skillArr['category_id'] = $skill['category'];
            if(!empty($skill['skills'])) {
                foreach($skill['skills'] as $skill) {
                    $skillArr['skill_id'] = $skill;
                    $result = $this->employermodel->insert_project_skills($skillArr);
                    if($result) {
                        $response_array = array('status' => 1);
                    } else {
                        $response_array = array('status' => 0);
                    }
                }
            }                            
        }
        return $response_array;
    }

    public function insertFiles($projectId,$files){
        foreach ($files['files'] as $file) {
            $ext =  substr(strrchr($file['file_name'],'.'),1);
            $filesArr['project_id'] = $projectId;
            $filesArr['file_name'] = $file['file_name'];
            $filesArr['type'] = $ext;
            $filesArr['created_at'] = date('Y-m-d H:i:s');
            $result = $this->employermodel->insert_project_files($filesArr);
            if($result) {
                $response_array = array('status' => 1);
            } else {
                $response_array = array('status' => 0);
            }
        }   
        return $response_array;
    }

    /* to upload project files */
    public function uploadProjectFiles($files,$userId,$projectId) {
        $this->load->library('upload');
        $number_of_files_uploaded = count($_FILES['files']['name']);

        if (!is_dir(USER_PATH.$userId)) {
            mkdir('./'.USER_PATH.$userId, 0777, TRUE);
            chmod(getcwd() . '/'.USER_PATH.$userId,0777); // CHMOD file
        }

        for ($i = 0; $i < $number_of_files_uploaded; $i++) {
            $ext =  substr(strrchr($files["files"]["name"][$i],'.'),1);
            if(($ext == 'gif') || ($ext == 'jpg') || ($ext == 'png')) {
                if (!is_dir(USER_PATH.$userId.'/projects/'.$projectId.'/images')) {
                    mkdir('./'.USER_PATH.$userId.'/projects/'.$projectId.'/images', 0777, TRUE);
                    chmod(getcwd() . '/'.USER_PATH.$userId.'/projects/',0777);
                    chmod(getcwd() . '/'.USER_PATH.$userId.'/projects/'.$projectId,0777);
                    chmod(getcwd() . '/'.USER_PATH.$userId.'/projects/'.$projectId.'/images',0777);
                }
                $target_dir = getcwd() . '/'.USER_PATH.$userId.'/projects/'.$projectId.'/images/';    
            } else {
                if (!is_dir(USER_PATH.$userId.'/projects/'.$projectId.'/files')) {
                    mkdir('./'.USER_PATH.$userId.'/projects/'.$projectId.'/files', 0777, TRUE);
                    chmod(getcwd() . '/'.USER_PATH.$userId.'/projects/'.$projectId.'/files',0777);
                }
                $target_dir = getcwd() . '/'.USER_PATH.$userId.'/projects/'.$projectId.'/files/';
            }
            $_FILES['userfile']['name']     = $_FILES['files']['name'][$i];
            $_FILES['userfile']['type']     = $_FILES['files']['type'][$i];
            $_FILES['userfile']['tmp_name'] = $_FILES['files']['tmp_name'][$i];
            $_FILES['userfile']['error']    = $_FILES['files']['error'][$i];
            $_FILES['userfile']['size']     = $_FILES['files']['size'][$i];
            $config = array(
                'allowed_types' => '*',
                'max_size'      => 3000,
                'overwrite'     => FALSE,
                'upload_path'   => $target_dir,
                'encrypt_name' => TRUE,
                'create_thumb' => TRUE,
                'thumb_marker' => '_thumb'
            );
            $this->upload->initialize($config);
            if ( ! $this->upload->do_upload()) {
                $error = array('error' => $this->upload->display_errors());
                $response_array = array('status' => 0,'error' => $error);
            }
            else {
                $final_files_data[] = $this->upload->data();
                $response_array = array('status' => 1,'files' => $final_files_data);
            }
        }

        return $response_array;
    }//END uploadProjectFiles()

    /* get urgency */
    public function urgency_get() {
        $result =  $this->employermodel->get_urgency();
        $response = array('status' => 1, 'urgency' => $result);
        echo json_encode($response);
        exit();
    }//END urgency()

    /* to get all projects */
    public function projectList_get() {
        $result =  $this->employermodel->get_projects();
        if ($result) {
            $data = array();
            $i = 0;
            foreach ($result as $res) {
                $data['project'][$i]['id'] = $res['id'];
                $data['project'][$i]['name'] = $res['name'];
                $data['project'][$i]['reference_number'] = $res['reference_number'];                
                $data['project'][$i]['description'] = $res['description'];
                $data['project'][$i]['category'] = $res['category'];
                $data['project'][$i]['created_at'] = $res['created_at'];
                $data['project'][$i]['range_from'] = $res['range_from'];
                $data['project'][$i]['range_to'] = $res['range_to'];
                $data['project'][$i]['freelancer_id'] = $res['freelancer_id'];
                $data['project'][$i]['freelancer_firstname'] = $res['freelancer_firstname'];
                $data['project'][$i]['freelancer_lastname'] = $res['freelancer_lastname'];
                $data['project'][$i]['payment_type'] = $res['payment_type'];
                $data['project'][$i]['start_date'] = $res['start_date'];
                $data['project'][$i]['project_days'] = $res['project_days'];
                $data['project'][$i]['total_project_cost'] = $res['total_project_cost'];

                $tasks =  $this->employermodel->get_tasks($res['id']);
                foreach($tasks as $s)
                    $data['project'][$i]['tasks'][] = $s;

                $i++;
            }
            $response = array('status' => 1, 'project_data' => $data);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END projectList()

    /* get tasks */
    public function taskList_get() {
        $projectId = $this->get('project_id');
        if($projectId) {
            $result =  $this->employermodel->get_tasks($projectId);
            $response = array('status' => 1, 'tasks' => $result);
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'No project selected.');
        }
        echo json_encode($response);
        exit();
    }//END taskList()

    /* to save task */
    public function createTask_post() {
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_id', 'Project Id', 'trim|numeric|xss_clean|required');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('name','project_id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            if($this->post('task_id')){
                $taskId = $this->post('task_id');
                $data = array( 
                    'name' => $this->post('name'),
                    'project_id' => $this->post('project_id'),
                );
                $result = $this->employermodel->update_task($data,$taskId);
                if ($result) {
                    http_response_code(200);
                    $response = array('status' => 1, 'message' => 'Task updated successfully!');
                } else {
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            } else {
                $userId = $this->post('user_id');
                $data = array( 
                    'name' => $this->post('name'),
                    'project_id' => $this->post('project_id'),
                    'created_at' => date('Y-m-d H:i:s')
                );
                
                $result = $this->employermodel->create_task($data);
                if ($result) {
                    http_response_code(200);
                    $response = array('status' => 1, 'message' => 'Task created successfully');
                } else {
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }  
            }
        }
        echo json_encode($response); 
        exit();
    }//END createTask()

    /* to delete task */
    public function deleteTask_post() {
        $tasks = json_decode($this->input->post('tasks'), true);
        http_response_code(401);
        if(!empty($tasks)) {
            $result = $this->employermodel->delete_task($tasks);
            if ($result) {
                http_response_code(200);
                $response = array('status' => 1, 'message' => 'Task deleted successfully');
            } else {
                $response = array('status' => 0, 'error' => 'Something went wrong!');
            }
        } else {
            $response = array('status' => 0, 'error' => 'Please select a task');
        }
        echo json_encode($response); 
        exit();
    }//END deleteTask()

    /* get task information */
    public function taskInfo_get() {
        $taskId = $this->get('id');
        if($taskId) {
            $result =  $this->employermodel->get_task($taskId);
            $response = array('status' => 1, 'task' => $result);
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END taskList()

    public function biddedProjects_post() {
        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';

            $getProjects = $this->employermodel->get_all_bidded_projects($user_id);
            if ($getProjects) {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'Bidded Projects Found!', 'projects' => $getProjects);
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Bidded Projects not Found!');
            }            
        } else {
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }           
        
        echo json_encode($response_array);
    }

    public function hideThisProject_post() {
        $this->form_validation->set_rules('bidder_id', 'Bid Id', 'trim|numeric|xss_clean|required');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('bidder_id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';

                $bidder_id = $this->post('bidder_id');
                $this->load->model('bidsmodel');
                $hideThisProject = $this->bidsmodel->hide_this_project($bidder_id);
                if ($hideThisProject) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'Bid Hidden now!');
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Bid Hidden failed!');
                }            
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    }

    public function declineProjectBid_post() {
        $this->form_validation->set_rules('bidder_id', 'Bid Id', 'trim|numeric|xss_clean|required');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('bidder_id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';

                $bidder_id = $this->post('bidder_id');
                $this->load->model('bidsmodel');
                $declineProjectBid = $this->bidsmodel->decline_project_bid($bidder_id);
                if ($declineProjectBid) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'Project Declined!');
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Project Decline failed!');
                }            
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    }    

    public function talkToBidder_post() {
        $this->form_validation->set_rules('bidder_id', 'Bid Id', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('message', 'Message', 'trim|xss_clean|required');
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('bidder_id', 'message');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';

                $bidder_id = $this->post('bidder_id');
                $message = $this->post('message');

                $data = array('message' => $message, 'bidder_id' => $bidder_id);

                $this->load->model('bidsmodel');
                $talkToBidder = $this->bidsmodel->talk_to_bidder($data);
                if ($talkToBidder) {
                    http_response_code(200);
                    sendMail('john@mailinator.com', $message, 'Talk to bidder');
                    $response_array = array('status' => 1, 'message' => 'Message sent!');
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Message send failed!');
                }            
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    } 

    public function checkProjectAndUserSlug_post() {
        $this->form_validation->set_rules('project_slug', 'Project', 'trim|xss_clean|required');
        $this->form_validation->set_rules('user_slug', 'User', 'trim|xss_clean|required');

        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('project_slug', 'user_slug');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';

                $project_slug = $this->post('project_slug');
                $user_slug = $this->post('user_slug');
                
                $this->load->model('bidsmodel');
                $checkProductSlug = $this->bidsmodel->check_product_slug($project_slug, $user_id);
                if ($checkProductSlug) {
                    $checkUserSlug = $this->bidsmodel->check_user_slug($user_slug);
                    if($checkUserSlug) {
                        $checkUserBidddedProject = $this->bidsmodel->check_user_biddded_project($checkProductSlug->id, $checkUserSlug->id);
                        if($checkUserBidddedProject) {
                            http_response_code(200);
                            $response_array = array('status' => 1, 'message' => 'Move for Payment Process!', 'project_id' => $checkProductSlug->id, 'freelancer_id' => $checkUserSlug->id);
                        } else {
                            http_response_code(401);
                            $response_array = array('status' => 0, 'message' => 'Invalid Bid of User on this Project!');
                        }                        
                    } else {
                        http_response_code(401);
                        $response_array = array('status' => 0, 'message' => 'User is not Valid!');
                    }                    
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Project is not Valid!');
                }            
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    }

    public function paymentProcess_post() {
        $this->form_validation->set_rules('project_id', 'Project ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('freelancer_id', 'Freelancer ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('payment_type', 'Payment Type', 'trim|xss_clean|required');
        $this->form_validation->set_rules('initial_amt', 'Hourly Rate', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_hours', 'Total Project Hours', 'trim|xss_clean|required');
        $this->form_validation->set_rules('hours_per_week', 'Max Hours per Week', 'trim|xss_clean|required');
        $this->form_validation->set_rules('start_date', 'Start Date', 'trim|xss_clean|required');
        $this->form_validation->set_rules('end_date', 'End Date', 'trim|xss_clean|required');
        $this->form_validation->set_rules('agreement_desc', 'Agreement Overview', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_days', 'Total Project Days', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_weeks', 'Total Project Weeks', 'trim|xss_clean|required');
        $this->form_validation->set_rules('per_week_amt', 'Per Week Amount', 'trim|xss_clean|required');
        $this->form_validation->set_rules('total_project_cost', 'Total Project Cost', 'trim|xss_clean|required');
        $this->form_validation->set_rules('payment_status', 'Payment Status', 'trim|xss_clean|required');
        
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('project_id', 'freelancer_id', 'payment_type', 'initial_amt', 'project_hours', 'hours_per_week', 'start_date', 'end_date', 'agreement_desc', 'project_days', 'project_weeks', 'per_week_amt', 'total_project_cost', 'payment_status');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $this->load->model('hirefreelancermodel');
                $check_hire_freelancer = $this->hirefreelancermodel->check_hire_freelancer($this->post('project_id'), $this->post('freelancer_id'));
                if($check_hire_freelancer) {
                    // Update

                    $data = array(
                        'payment_type' => $this->post('payment_type'),
                        'initial_amt' => $this->post('initial_amt'),
                        'project_hours' => $this->post('project_hours'),
                        'hours_per_week' => $this->post('hours_per_week'),
                        'start_date' => $this->post('start_date'),
                        'end_date' => $this->post('end_date'),
                        'agreement_desc' => $this->post('agreement_desc'),
                        'project_days' => $this->post('project_days'),
                        'project_weeks' => $this->post('project_weeks'),
                        'per_week_amt' => $this->post('per_week_amt'),
                        'total_project_cost' => $this->post('total_project_cost'),
                        'payment_status' => $this->post('payment_status')                        
                    );           
                    $hireFreelancer = $this->hirefreelancermodel->update_hire_freelancer($check_hire_freelancer['id'], $data);
                } else {
                    // Insert 

                    $data = array(
                        'project_id' => $this->post('project_id'),
                        'freelancer_id' => $this->post('freelancer_id'),
                        'payment_type' => $this->post('payment_type'),
                        'initial_amt' => $this->post('initial_amt'),
                        'project_hours' => $this->post('project_hours'),
                        'hours_per_week' => $this->post('hours_per_week'),
                        'start_date' => $this->post('start_date'),
                        'end_date' => $this->post('end_date'),
                        'agreement_desc' => $this->post('agreement_desc'),
                        'project_days' => $this->post('project_days'),
                        'project_weeks' => $this->post('project_weeks'),
                        'per_week_amt' => $this->post('per_week_amt'),
                        'total_project_cost' => $this->post('total_project_cost'),
                        'payment_status' => $this->post('payment_status')                        
                    );           
                    $hireFreelancer = $this->hirefreelancermodel->hire_freelancer($data);
                }
                
                if ($hireFreelancer) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'Move for Paypal for Payment', 'info' => $hireFreelancer);
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Invalid data supplied!');
                }     
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    }    

    public function paymentDone_post() {
        $this->form_validation->set_rules('id', 'Record ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('intent', 'Intent', 'trim|xss_clean|required');
        $this->form_validation->set_rules('payer_id', 'Payer ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('payment_id', 'Payment ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('payment_token', 'Payment Token', 'trim|xss_clean|required');
        $this->form_validation->set_rules('project_id', 'Project ID', 'trim|xss_clean|required');
        $this->form_validation->set_rules('freelancer_id', 'Freelancer ID', 'trim|xss_clean|required');
                
        http_response_code(401);
        if ($this->form_validation->run() == FALSE) {
            $array = array('id', 'intent', 'payer_id', 'payment_id', 'payment_token', 'project_id', 'freelancer_id');
            $myValid = checkValidation($array);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $this->load->model('hirefreelancermodel');
                
                $data = array(
                    'intent' => $this->post('intent'),
                    'payer_id' => $this->post('payer_id'),
                    'payment_id' => $this->post('payment_id'),
                    'payment_token' => $this->post('payment_token'),
                    'payment_status' => 1,
                    'payment_created' => date('Y-m-d H:i:s')                    
                );           
                $updatePaymentInfo = $this->hirefreelancermodel->update_payment_info($this->post('id'), $data);
                if ($updatePaymentInfo) {
                    http_response_code(200);

                    $this->load->model('bidsmodel');
                    $bidsmodel = $this->bidsmodel->update_all_bids($this->post('project_id'), $this->post('freelancer_id'));                    

                    $response_array = array('status' => 1, 'message' => 'Congratulations! Your payment is done successfully!');
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Unable to update Payment Information');
                }     
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }        
        
        echo json_encode($response_array);
    }    
    
    public function addComplaints_post() {
        $this->form_validation->set_rules('reference_number', 'Reference Number', 'trim|required');
        $this->form_validation->set_rules('project_id', 'Project ID', 'trim|required');
        $this->form_validation->set_rules('message', 'Message', 'trim|required');
        $this->form_validation->set_rules('type', 'Type', 'trim|required');
                        
        if ($this->form_validation->run() == FALSE) {
            $array = array('reference_number', 'project_id', 'user_id', 'message', 'type');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $data['reference_number'] = $this->post('reference_number');
                $data['project_id'] = $this->post('project_id');
                $data['user_id'] = $user_id;                
                $data['message'] = $this->post('message');
                $data['type'] = $this->post('type');                

                http_response_code(200);
                $this->load->model('complaintsmodel');                
                $insertComplaint = $this->complaintsmodel->insert_complaint($data);

                if ($insertComplaint) {
                    $response_array = array('status' => 1, 'message' => 'Thank you for Filing a complaint to us!');
                } else {
                    $response_array = array('status' => 0, 'message' => 'Unable to provide complaints for this Project!');
                }
            }else{
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }   

}

?>
