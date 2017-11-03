<?php

class Freelancermodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    function updateBankDetails($data, $user_id) {
        $this->db->select('*');
        $this->db->from('users_bank_details');
        $this->db->where('user_id', $user_id);        

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            $this->db->where('user_id', $user_id);
            $query = $this->db->update('users_bank_details', $data);
            if($query){
               return true; 
            }else{
               return false;
            }   
        } else {
            $data['user_id'] = $user_id;
            return $this->insertBankDetails($data);
        }        
    }

    function insertBankDetails($data) {
        $query = $this->db->insert('users_bank_details', $data);
        if($query) {
            return true;
        } else {
            return false;
        }
    }

    function getBankDetails($user_id) {
        $this->db->select('id, bank_name, bank_code, bank_account_number, bank_iban');
        $this->db->from('users_bank_details');
        $this->db->where('user_id', $user_id);        

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return false;
        }
    }
 
    function update_user_photo($data, $user_id) {
        $this->db->select('profile_image');
        $this->db->from('users_profile');
        $this->db->where('user_id', $user_id);        

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            $profile_image = $query->row()->profile_image;
            $image_path = USER_PATH . $user_id . '/avatar/' . $profile_image;
            $image_thumb_path = USER_PATH . $user_id . '/avatar/thumbs/' . $profile_image;
            if(!empty($profile_image) && file_exists($image_path)) {
                // Unlink Image and then Upload New                
                if(unlink($image_path) && file_exists($image_thumb_path)) {
                    unlink($image_thumb_path);
                }                
            }
        }        

        $this->db->where('user_id', $user_id);
        $query = $this->db->update('users_profile', $data);
        if($query) {
           return true; 
        } else {
           return false;
        }
    }

    function update_user_skills($skills, $user_id) {
        $this->db->set('is_deleted', 1);
        $this->db->where('user_id', $user_id);
        $query = $this->db->update('users_skills');

        if(!empty($skills)) {
            foreach($skills as $skill) {
                $checkExists = $this->checkSkillExists($user_id, $skill->id, $skill->parent_category_id);
                if($checkExists) {
                    // Update Skill
                    $this->update_user_skill($checkExists->id);
                } else {
                    // Insert Skill
                    $data = [];
                    $data['user_id'] = $user_id;
                    $data['skill_id'] = $skill->id;
                    $data['category_id'] = $skill->parent_category_id;
                    $data['is_deleted'] = 0;
                    $data['status'] = 1;

                    $this->insert_user_skill($data);
                }
            }
        }

        return true;
    }

    function checkSkillExists($user_id, $skill_id, $category_id) {
        $this->db->select('id');
        $this->db->from('users_skills');
        $this->db->where('user_id', $user_id);
        $this->db->where('skill_id', $skill_id);
        $this->db->where('category_id', $category_id);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return false;
        }
    }

    function insert_user_skill($data) {
        $query = $this->db->insert('users_skills', $data);
        if($query) {
            return true;
        } else {
            return false;
        }
    }

    function update_user_skill($id) {
        $this->db->set('is_deleted', 0);
        $this->db->where('id', $id);
        $query = $this->db->update('users_skills');

        if($query) {
            return true;
        } else {
            return false;
        }
    }

    /* to get default percentage */
    function get_default_percentage() {
        $this->db->select('*');
        $this->db->from('default_percentage');
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }

    function search_projects($searchData, $user_id) {
        //print_r($searchData);die;

        $this->db->select('pro_users_profile.user_id as user_id, pro_users_profile.firstname as first_name, pro_users_profile.lastname as last_name, pro_projects.id as project_id, pro_projects.name as project_name, pro_projects.slug as project_slug, pro_projects.description as project_description, pro_categories.name as category_name, pro_currency.name as currency_name, pro_currency.symbol as currency_symbol, pro_budgets.range_to, pro_budgets.range_from, pro_urgency.days as urgency, (SELECT GROUP_CONCAT(name) as skill_names FROM `pro_project_skills` JOIN pro_skills ON pro_project_skills.skill_id=pro_skills.id WHERE `project_id`=`pro_projects`.`id` AND pro_skills.status=1 AND pro_skills.is_deleted=0) as skill_names');
        $this->db->from('projects');
        $this->db->join('pro_categories', 'pro_projects.category = pro_categories.id', 'INNER');
        $this->db->join('pro_budgets', 'pro_projects.budget = pro_budgets.id', 'INNER');
        $this->db->join('pro_currency', 'pro_budgets.currency_id = pro_currency.id', 'INNER');
        $this->db->join('pro_urgency', 'pro_projects.urgency = pro_urgency.id', 'INNER');
        $this->db->join('pro_users', 'pro_projects.user_id = pro_users.id', 'INNER');
        $this->db->join('pro_users_profile', 'pro_users.id = pro_users_profile.user_id', 'INNER');

        $this->db->where('pro_projects.approved', 1);
        $this->db->where('pro_projects.status', 0);
        $this->db->where('pro_projects.is_deleted', 0);
        
        $this->db->where('pro_categories.status', 1);
        $this->db->where('pro_categories.is_deleted', 0);

        $this->db->where('pro_budgets.status', 1);
        $this->db->where('pro_budgets.is_deleted', 0);

        $this->db->where('pro_currency.status', 1);

        $this->db->where('pro_users.status', 1);
        $this->db->where('pro_users.is_deleted', 0);

        if(!empty($searchData['category'])) {
            $this->db->where('projects.category', $searchData['category']);
        }

        if(!empty($searchData['budgetType'])) {
            $this->db->where('projects.type', $searchData['budgetType']);
        }

        if(!empty($searchData['budget'])) {
            $this->db->where('projects.budget', $searchData['budget']);
        }

        if(!empty($searchData['urgency'])) {
            $this->db->where('projects.urgency', $searchData['urgency']);
        }

        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }

    }

    function get_single_project($project_slug) {
        $this->db->select('pro_users_profile.user_id as user_id, pro_users_profile.firstname as first_name, pro_users_profile.lastname as last_name, pro_projects.id as project_id, pro_projects.name as project_name, pro_projects.slug as project_slug, pro_projects.description as project_description, pro_categories.name as category_name, pro_currency.name as currency_name, pro_currency.symbol as currency_symbol, pro_budgets.range_to, pro_budgets.range_from, pro_urgency.days as urgency, (SELECT GROUP_CONCAT(name) as skill_names FROM `pro_project_skills` JOIN pro_skills ON pro_project_skills.skill_id=pro_skills.id WHERE `project_id`=`pro_projects`.`id` AND pro_skills.status=1 AND pro_skills.is_deleted=0) as skill_names, projects.created_at as project_created, NOW() as project_current_date');
        $this->db->from('projects');
        $this->db->join('pro_categories', 'pro_projects.category = pro_categories.id', 'INNER');
        $this->db->join('pro_budgets', 'pro_projects.budget = pro_budgets.id', 'INNER');
        $this->db->join('pro_currency', 'pro_budgets.currency_id = pro_currency.id', 'INNER');
        $this->db->join('pro_urgency', 'pro_projects.urgency = pro_urgency.id', 'INNER');
        $this->db->join('pro_users', 'pro_projects.user_id = pro_users.id', 'INNER');
        $this->db->join('pro_users_profile', 'pro_users.id = pro_users_profile.user_id', 'INNER');

        $this->db->where('pro_projects.approved', 1);
        $this->db->where('pro_projects.status', 0);
        $this->db->where('pro_projects.is_deleted', 0);

        $this->db->where('pro_projects.slug', $project_slug);        
        
        $this->db->where('pro_categories.status', 1);
        $this->db->where('pro_categories.is_deleted', 0);

        $this->db->where('pro_budgets.status', 1);
        $this->db->where('pro_budgets.is_deleted', 0);

        $this->db->where('pro_currency.status', 1);

        $this->db->where('pro_users.status', 1);
        $this->db->where('pro_users.is_deleted', 0);
       
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            return $query->row_array();
        } else {
            return false;
        }
    }


    function view_profile($userSlug) {

        //SELECT * FROM `pro_users` JOIN `pro_users_profile` ON pro_users.id=pro_users_profile.user_id WHERE slug='conchita-legas' AND status=1 AND is_deleted=0 
        $this->db->select('users.id as user_id');
        $this->db->from('users');
        $this->db->join('users_profile', 'users.id = users_profile.user_id', 'INNER');
        $this->db->join('roles', 'users.role_id = roles.id', 'INNER');
        
        $this->db->where('users.slug', $userSlug);
        $this->db->where('users.status', 1);
        $this->db->where('users.is_deleted', 0);
       
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {

            $this->load->model('authmodel');

            $user_id = $query->row()->user_id;
            $user_profile = $this->authmodel->get_user_profile($user_id);
            $user_skills = $this->authmodel->get_user_skills($user_id);

            return array(
                'profile' => $user_profile,
                'skills' => $user_skills
            );
        } else {
            return false;
        }
    }

}

?>
