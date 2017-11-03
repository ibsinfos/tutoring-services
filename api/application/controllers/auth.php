<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
header("Access-Control-Expose-Headers: Access-token, status");
//header("Access-Control-Expose-Headers: status");

/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Auth extends REST_Controller {

    function __construct() {
        parent::__construct();
        error_reporting(E_ERROR | E_PARSE);
        $this->load->model('authmodel');        
        $this->load->model('employermodel');
        $this->load->helper('email_helper');        
    }
    
    public function login_post() {

        $this->form_validation->set_rules('password', 'Password', 'required');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('type', 'Type', 'required');

        if ($this->form_validation->run() == FALSE) {
            $array = array('email', 'password');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'error' => $myValid);
        } else {
            //check for existance
            $type = $this->post('type');
            $check = $this->authmodel->check_user_existance($this->post('email'));
            if ($check) {
                //check for email verified
                if ($check['is_email_verified']) {
                    //check for active profile
                    if ($check['status']) {
                        //check for right password
                        $data['email'] = $this->post('email');
                        $data['password'] = $this->post('password');
                        if (md5($this->post('password')) == $check['password']) {
                            if(($check['role_id'] == 1  && $type === 'admin') || ($check['role_id'] != 1  && $type === 'user'))   {
                                $randstr = bin2hex(openssl_random_pseudo_bytes('32'));
                                $token = $check['id'] . '&' . $randstr;
                                $token_id = base64_encode($token);
                                $field['id'] = $check['id'];
                                $field['token'] = $token_id;
                                //set token in login profile
                                $setToken = $this->authmodel->set_user_token($field);
                                http_response_code(200);
                                $response_array = array('status' => 1, 'message'=>'User Logged In', 'user_detail' => $this->authmodel->get_user_profile($check['id']));
                                header('Access-token:' . $token_id);
                            } else {
                                http_response_code(401);
                                $response_array = array('status' => 0, 'message' => 'Incorrect Email or Password!');
                            }                            
                        } else {
                            http_response_code(401);
                            $response_array = array('status' => 0, 'message' => 'Incorrect password!');
                        }
                    } else {
                        http_response_code(401);
                        $response_array = array('status' => 0, 'message' => 'Admin de-activated your profile!');
                    }
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 2, 'message' => 'Still we are waitting for your email verification!');
                }
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'No user exists with this Email');
            }
        }
        echo json_encode($response_array);
    }   

    //check token
    public function checkToken_post() {
        $token = $this->post('token');
        $type = $this->post('type');
        http_response_code(200);
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $data['id'] = isset($udata[0]) ? $udata[0] : '';
            $data['token'] = $token;
            $userDetail = $this->authmodel->checkTokenTrue($data);
            if ($userDetail) {
                if($userDetail['role_id'] == 1 && $type == 'admin') {
                    // Token is Valid for Admin Routes
                    $token_response = array('status' => 1, 'user_detail' => $userDetail);
                    header('Access-token:' . $userDetail['token']);
                } else if($userDetail['role_id'] != 1 && $type == 'user') {
                    // Token is Valid for User Routes
                    $token_response = array('status' => 1, 'user_detail' => $userDetail);
                    header('Access-token:' . $userDetail['token']);
                } else {
                    http_response_code(401);
                    $token_response = array('status' => 0, 'error' => 'Not a valid token!');
                }
            } else {
                http_response_code(401);
                $token_response = array('status' => 0, 'error' => 'Not a valid token!');
            }
        } else {
            http_response_code(401);
            $token_response = array('status' => 0, 'error' => 'Bad request!');
        }
        echo json_encode($token_response);
    }

    //change password
    public function changePassword_post() {

        $this->form_validation->set_rules('oldpassword', 'Old password', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');
        $this->form_validation->set_rules('cpassword', 'Confirm Password', 'trim|required|matches[password]');

        // controller code
        if ($this->form_validation->run() == FALSE) {
            $array = array('oldpassword', 'password', 'cpassword');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            $token = $this->post('token');
            if (!empty($token) && $token != 'null') {
                $decode_token = base64_decode($token);
                $udata = explode('&', $decode_token);
                $user_id = isset($udata[0]) ? $udata[0] : '';
                
                $checkOldPass = $this->authmodel->checkOldPassword($this->post('oldpassword'), $user_id, $this->post('token'));
                if ($checkOldPass) {
                    $data['password'] = md5($this->post('password'));
                    $updateNewPass = $this->authmodel->updateOldPassword($data, $user_id);
                    if ($updateNewPass) {
                        http_response_code(200);
                        $response_array = array('status' => 1, 'message' => 'Password updated successfully!');
                    } else {
                        http_response_code(401);
                        $response_array = array('status' => 0, 'message' => 'Unable to update Password!');
                    }
                } else {
                    http_response_code(200);
                    $response_array = array('status' => 0, 'message' => 'Old password does not match!');
                }
            } else {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
            }
        }
        echo json_encode($response_array);
    }

    //forgot password
    public function forgotPassword_post() {
        http_response_code(401);
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        if ($this->form_validation->run() == FALSE) {
            $array = array('email');
            $myValid = $this->checkValidation($array);
            $response_array = array('status' => 0, 'error' => $myValid);
        } else {
            $exist = $this->authmodel->check_user_existance($this->post('email'));
            if ($exist) {
                if ($exist['is_email_verified']) {
                    if ($exist['status']) {
                        $password = $this->getRandomString(8);
                        $result = $this->authmodel->reset_password($this->post('email'),md5($password));
                        if($result) {
                            // Send Email here for Reset Password Link
                            $msg = 'Hi , <br>';
                            $msg .= 'Your new password is , <br> <b>' . $password . '</b><br>';
                            $mailSent = sendMail('john@mailinator.com', $msg, 'Password Reset');
                            if($mailSent) {
                                http_response_code(200);
                                $response_array = array('status' => 1, 'message' => 'Please check your mail for new password!');    
                            } else {
                                $response_array = array('status' => 0, 'message' => 'Unable to send email. Please try again later!');    
                            }
                        } else {
                            $response_array = array('status' => 0, 'message' => 'Something went wrong!');
                        }
                    } else {
                        $response_array = array('status' => 0, 'message' => 'Your account is not active yet!');
                    }
                } else {
                    $response_array = array('status' => 0, 'message' => 'You have not verified your account yet. Please verify your Account!');
                }
            } else {
                $response_array = array('status' => 0, 'message' => 'Email doesn\'t not exist!');
            }
        }
        echo json_encode($response_array);
        exit();
    }

    function getRandomString($length) {
        $key = '';
        $keys = array_merge(range(0, 9), range('a', 'z'));
        for ($i = 0; $i < $length; $i++) {
            $key .= $keys[array_rand($keys)];
        }
        return $key;
    }

    //check validations
    public function checkValidation($fields) {
        $error_message = array();
        //echo validation_errors();die;
        foreach ($fields as $field) {
            if (form_error($field)) {
                $error = form_error($field);
                $error_message[$field] = $error;
            }
        }
        return $error_message;
    }

    function updateProfile_post() {
        $this->form_validation->set_rules('firstname', 'First Name', 'trim|required');
        $this->form_validation->set_rules('lastname', 'Last Name', 'trim|required');
                
        if ($this->form_validation->run() == FALSE) {
            $array = array('firstname', 'lastname');
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

    public function checkEmailExists_post() {
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');

        if ($this->form_validation->run() == FALSE) {
            $array = array('email');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            //check for existance
            $check = $this->authmodel->check_user_existance($this->post('email'));
            if ($check) {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Email is already exists');
            } else {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'Email does not exist!');
            }
        }
        
        echo json_encode($response_array);
    }  

    function freelancerSignUp_post() {
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'required');
        $this->form_validation->set_rules('cpassword', 'Confirm Password', 'trim|required|matches[password]');
        $this->form_validation->set_rules('firstname', 'First Name', 'trim|required');
        $this->form_validation->set_rules('lastname', 'Last Name', 'trim|required');
        $this->form_validation->set_rules('phone', 'Phone', 'trim|required');
        $this->form_validation->set_rules('country', 'Country', 'trim|required');
        
        
        if ($this->form_validation->run() == FALSE) {
            $array = array('email', 'password', 'cpassword', 'firstname','lastname', 'phone', 'country');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            //check for existance
            $check = $this->authmodel->check_user_existance($this->post('email'));
            if ($check) {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Email is already exists');
            } else {

                $config = array(
                    'table' => 'users',
                    'id' => 'id',
                    'field' => 'slug',
                    'title' => 'title',
                    'replacement' => 'dash' // Either dash or underscore
                );
                $this->load->library('slug', $config);

                $data['firstname'] = $this->post('firstname');
                $data['lastname'] = $this->post('lastname');
                $data['phone'] = $this->post('phone');
                $data['country'] = $this->post('country');
                //$data['skills'] = $this->post('skills');
                $data['email'] = $this->post('email');
                $data['password'] = md5($this->post('password'));                
                $data['slug'] = $this->slug->create_uri(array('title' => $data['firstname'] . ' ' . $data['lastname']));

                $skillsData = json_decode($this->input->post('skills'), true);

                $userSignup = $this->authmodel->freelancerSignup($data, $skillsData);
                if ($userSignup) {
                    http_response_code(200);
                    $response_array = array('status' => 1, 'message' => 'You are registered with us successfully!');                    
                } else {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'message' => 'Account creation failed. Please try again later!');
                }
            }
        }
        
        echo json_encode($response_array);
    }

    function employerSignUp_post() {
        $this->form_validation->set_rules('firstname', 'First Name', 'trim|required');
        $this->form_validation->set_rules('lastname', 'Last Name', 'trim|required');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'required');
        $this->form_validation->set_rules('cpassword', 'Confirm Password', 'trim|required|matches[password]');

        $this->form_validation->set_rules('projectTitle', 'Project Title', 'trim|xss_clean|required');
        $this->form_validation->set_rules('projectDescription', 'Project Description', 'trim|xss_clean|required');

        $this->form_validation->set_rules('projectCategory', 'Category', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('projectBudgetType', 'Budget Type', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('projectBudget', 'Budget', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('projectUrgency', 'Urgency', 'trim|numeric|xss_clean|required');
        $this->form_validation->set_rules('projectSkills', 'Skills', 'trim|xss_clean|required'); 
        
        if ($this->form_validation->run() == FALSE) {
            $array = array('email', 'password', 'cpassword', 'firstname','lastname', 'projectTitle', 'projectDescription', 'projectCategory', 'projectBudgetType', 'projectBudget', 'projectUrgency', 'projectSkills');
            $myValid = $this->checkValidation($array);
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => $myValid);
        } else {
            //check for existance
            $check = $this->authmodel->check_user_existance($this->post('email'));
            if ($check) {
                http_response_code(401);
                $response_array = array('status' => 0, 'message' => 'Email is already exists');
            } else {
                if ($_FILES['files']['error'][0] > 0) {
                    http_response_code(401);
                    $response_array = array('status' => 0, 'error' => 'Please select a valid file!');
                } else {

                    $config = array(
                        'table' => 'users',
                        'id' => 'id',
                        'field' => 'slug',
                        'title' => 'title',
                        'replacement' => 'dash' // Either dash or underscore
                    );
                    $this->load->library('slug', $config);
                       
                    $userData = array(
                        'email' => $this->post('email'),
                        'password' => $this->post('password'),
                        'slug' => $this->slug->create_uri(array('title' => $data['firstname'] . ' ' . $data['lastname'])),
                        'role_id' => 3,
                        'is_email_verified' => 0,
                        'is_deleted' => 0,
                        'status' => 0
                    );

                    $userProfileData = array(
                        'firstname' => $this->post('firstname'),
                        'lastname' => $this->post('lastname'),
                        'skills' => '',
                        'country' => '',
                        'phone' => ''
                    );

                    $projectData = array( 
                        'name' => $this->post('projectTitle'),
                        'description' => $this->post('projectDescription'),
                        'category' => $this->post('projectCategory'),
                        'type' => $this->post('projectBudgetType'),
                        'budget' => $this->post('projectBudget'),
                        'urgency' => $this->post('projectUrgency'),
                        'created_at' => date('Y-m-d H:i:s')
                    );
    
                    $skillsData = json_decode($this->input->post('projectSkills'), true);

                    $userSignup = $this->authmodel->employerSignup($userData, $userProfileData, $projectData, $skillsData);    
                    if ($userSignup) {
                        http_response_code(200);
                        $response_array = array('status' => 1, 'message' => 'You are registered with us successfully!');
                    } else {
                        http_response_code(401);
                        $response = array('status' => 0, 'error' => 'Unable to register Employer. Please try again later!');
                    }
                }                
            }
        }
        
        echo json_encode($response_array);
    }

    function getUserSkills_post() {

        $token = $this->post('token');
        if (!empty($token) && $token != 'null') {
            $decode_token = base64_decode($token);
            $udata = explode('&', $decode_token);
            $user_id = isset($udata[0]) ? $udata[0] : '';            

            $userSkills = $this->authmodel->get_user_skills($user_id);
            if ($userSkills) {
                http_response_code(200);
                $response_array = array('status' => 1, 'message' => 'User Skills found!', 'details' => $userSkills);
            } else {
                http_response_code(200);
                $response_array = array('status' => 0, 'message' => 'No User Skills found!');
            }
        }else{
            http_response_code(401);
            $response_array = array('status' => 0, 'message' => 'You are not authorised user!');
        }

        echo json_encode($response_array);
    }

}

?>
