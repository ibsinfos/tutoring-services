<?php

class Authmodel extends CI_Model {

    function __construct() {
        parent::__construct();
        //$this->load->helper('general_helper');
    }

    function check_user_existance($email) {
        $this->db->select('id,email,password,role_id,is_email_verified,status');
        $this->db->from('users');
        $this->db->where('email', $email);
        $this->db->where('is_deleted', 0);
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query->num_rows() > 0) {
            return $query->row_array();
        } else {
            return false;
        }
    }

    function set_user_token($data){
        $this->db->set('token',$data['token']);
        $this->db->where('id', $data['id']);
        $this->db->update('users');
    }

    /* to reset password of user */
    function reset_password($email,$password) {
        $this->db->where('email', $email);
        $this->db->set('password',$password);
        $query = $this->db->update('users');
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END reset_password()

    function get_user_profile($user_id) {
        $this->db->select('users.id as user_id, firstname, lastname, email, cover_image, profile_image, address, city, country, phone, headline, bio, hourly_rate, roles.id as role_id, role_name');
        $this->db->from('users_profile');
        $this->db->join('users', 'users.id = users_profile.user_id', 'INNER');
        $this->db->join('roles', 'roles.id = users.role_id', 'INNER');
        $this->db->where('user_id', $user_id);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {

            $userData = $query->row_array();
            if(!empty($userData['profile_image'])) {
                $userData['profile_image'] = base_url() . USER_PATH . $userData['user_id'] . '/avatar/thumbs/' . $userData['profile_image'];
            }

            return $userData;
        } else {
            return false;
        }
    }

    function get_user_skills($user_id) {
        // SELECT category_id, pro_categories.name as `category_name`, skill_id, pro_skills.name as `skill_name`
        // FROM `pro_users_skills` 
        // JOIN pro_categories ON category_id=pro_categories.id
        // JOIN pro_skills ON skill_id=pro_skills.id 
        // WHERE user_id=23 AND pro_users_skills.status=1 AND pro_users_skills.is_deleted=0
        $this->db->select('users_skills.category_id, pro_categories.name as `category_name`, users_skills.skill_id, pro_skills.name as `skill_name`');
        $this->db->from('users_skills');
        $this->db->join('categories', 'users_skills.category_id = pro_categories.id', 'INNER');
        $this->db->join('skills', 'users_skills.skill_id = pro_skills.id', 'INNER');
        $this->db->where('users_skills.user_id', $user_id);
        $this->db->where('users_skills.status', 1);
        $this->db->where('users_skills.is_deleted', 0);
        $this->db->where('categories.status', 1);
        $this->db->where('categories.is_deleted', 0);
        $this->db->where('skills.status', 1);
        $this->db->where('skills.is_deleted', 0);
        $this->db->order_by('users_skills.category_id');

        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query->num_rows() > 0) {
            $skillsData = $query->result_array();
    
            $newSkillsData = [];
            if(!empty($skillsData)) {
                foreach($skillsData as $skills) {
                    $newSkillsData['category_details'][$skills['category_id']] = array(
                        'category_id' => $skills['category_id'],
                        'category_name' => $skills['category_name']
                    );

                    $newSkillsData['skill_details'][$skills['category_id']][] = array(
                        'id' => $skills['skill_id'],
                        'name' => $skills['skill_name'],
                    );
                }
            }

            return $newSkillsData;
        } else {
            return false;
        }
    }
    
    function checkTokenTrue($data) {
        $this->db->select('users.id,users.token, firstname, lastname, email, cover_image, profile_image, address, city, country, phone, headline, bio, hourly_rate, roles.id as role_id, role_name');
        $this->db->from('users');
        $this->db->join('users_profile', 'users_profile.user_id = users.id', 'INNER');
        $this->db->join('roles', 'roles.id = users.role_id', 'INNER');
        $this->db->where('users.id', $data['id']);
        $this->db->where('users.token', $data['token']);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            $userData = $query->row_array();
            if(!empty($userData['profile_image'])) {
                $userData['profile_image'] = base_url() . USER_PATH . $userData['id'] . '/avatar/thumbs/' . $userData['profile_image'];
            }

            return $userData;
        } else {
            return false;
        }
    }

    function update_profile($data, $user_id){
        $this->db->where('user_id', $user_id);
        $query = $this->db->update('users_profile', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }

    function checkOldPassword($old_password, $user_id, $token) {
        $this->db->select('id');
        $this->db->from('users');
        $this->db->where('password', md5($old_password));
        $this->db->where('id', $user_id);
        $this->db->where('token', $token);

        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query->num_rows() > 0) {
            return $query->row_array();
        } else {
            return false;
        }
    }

    function updateOldPassword($data, $user_id) {
        $this->db->where('id', $user_id);
        $query = $this->db->update('users', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }

    function freelancerSignup($data, $skillsData) {
        try {
            $this->db->trans_start();
            $this->db->trans_strict(FALSE);

            $usersData['email'] = $data['email'];
            $usersData['password'] = $data['password'];
            $usersData['slug'] = $data['slug'];
            $usersData['role_id'] = 3;
            $usersData['is_email_verified'] = 0;
            $usersData['is_deleted'] = 0;
            $usersData['status'] = 1;

            $query = $this->db->insert('users', $usersData);
            $user_id = $this->db->insert_id();
            if ($query) {
                if($user_id) {
                    $userProfileData['user_id'] = $user_id;
                    $userProfileData['firstname'] = $data['firstname'];
                    $userProfileData['lastname'] = $data['lastname'];
                    $userProfileData['phone'] = $data['phone'];
                    $userProfileData['country'] = $data['country'];

                    $query = $this->db->insert('users_profile', $userProfileData);
                    if($query) {
                        $skills = $skillsData;
                        foreach ($skills as $skill) {
                            $skillArr = array();
                            $skillArr['user_id'] = $user_id;
                            $skillArr['category_id'] = $skill['category'];
                            if(!empty($skill['skills'])) {
                                foreach($skill['skills'] as $skill) {
                                    $skillArr['skill_id'] = $skill;
                                    $this->authmodel->insert_user_skills($skillArr);

                                    $this->db->trans_complete();
                                }
                            }                            
                        }
                    }
                }
            }

            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                return FALSE;
            } else {
                $this->db->trans_commit();
                return $user_id;
            }
        } catch(Exception $e) {
            //throw new Exception('no data returned');
            return false;
        }        
    }

    /* to insert user skills */
    function insert_user_skills($data = '') {
        $query = $this->db->insert('users_skills', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }   
    }//END insert_user_skills()

    function employerSignup($userData, $userProfileData, $projectData, $skillsData) {
        try {
            $this->db->trans_start();
            $this->db->trans_strict(FALSE);

            $query = $this->db->insert('users', $userData);
            $user_id = $this->db->insert_id();
            if ($query) {
                if($user_id) {
                    $userProfileData['user_id'] = $user_id;
                    
                    $query = $this->db->insert('users_profile', $userProfileData);
                    if($query) {

                        $this->load->model('employermodel');
                        $projectData['user_id'] = $user_id;
                        $result = $this->employermodel->create_project($projectData);
                        if ($result) {
                            $skills = $skillsData;
                            $skillArr = array();
                            foreach ($skills as $skill) {
                                $skillArr['project_id'] = $result;
                                $skillArr['category_id'] = $skill['category'];
                                $skillArr['skills'] = implode(",", $skill['skills']);
                                $this->employermodel->insert_project_skills($skillArr);
                            }
                            $this->upload_project_files($_FILES, $user_id);
                            $this->db->trans_complete();
                        }
                    }
                }
            }

            if ($this->db->trans_status() === FALSE) {
                $this->db->trans_rollback();
                return FALSE;
            } else {
                $this->db->trans_commit();
                return $user_id;
            }
        } catch(Exception $e) {
            //throw new Exception('no data returned');
            return false;
        }        
    }

    function upload_project_files($files,$userId) {
        $limit = count($files["files"]["name"]);
        $image_array = array();
        if (!is_dir('uploads/users/' . $userId)) {
            mkdir('./uploads/users/' . $userId, 0777, TRUE);
            chmod(getcwd() . '/uploads/users/' . $userId,0777); // CHMOD file
        }
        for ($i=0; $i < $limit; $i++) { 
            $ext =  substr(strrchr($files["files"]["name"][$i],'.'),1);
            if(($ext == 'gif') || ($ext == 'jpg') || ($ext == 'png')) {
                if (!is_dir('uploads/users/' . $userId . '/images')) {
                    mkdir('./uploads/users/' . $userId . '/images', 0777, TRUE);
                    chmod(getcwd() . '/uploads/users/' . $userId . '/images',0777); // CHMOD file
                }
                $target_dir = getcwd() . '/uploads/users/' . $userId . '/images/';    
            } else {
                if (!is_dir('uploads/users/' . $userId . '/files')) {
                    mkdir('./uploads/users/' . $userId . '/files', 0777, TRUE);
                    chmod(getcwd() . '/uploads/users/' . $userId . '/files',0777); // CHMOD file
                }
                $target_dir = getcwd() . '/uploads/users/' . $userId . '/files/';
            }
            $target_file = $target_dir . basename($files["files"]["name"][$i]);
            $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
            $new_name = basename(time() .'_'.$i. '.' . $imageFileType);
            $newd = $target_dir . '/' . $new_name;
     
            if (move_uploaded_file($files["files"]["tmp_name"][$i], $newd)) {
                chmod($newd,0777); // CHMOD file
                $path = realpath(APPPATH . '../uploads/users/');    
                $config['image_library'] = 'gd2';
                $config['source_image'] = $path . '/' . $new_name;
                $this->load->library('image_lib', $config);
            }
            $image_array[] = $new_name;
        }
        return $image_array;
    }

}

?>
