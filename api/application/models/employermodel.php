<?php

class Employermodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to create new project */
    function create_project($data = '') {
        $query = $this->db->insert('projects', $data);
        $budget_id = $this->db->insert_id();
        if ($query) {
            return $budget_id;
        } else {
            return 0;
        }   
    }//END create_project()

    /* to update tasks */
    function update_task($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('project_tasks', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_task()

    /* to insert project skills */
    function insert_project_skills($data = '') {
        $query = $this->db->insert('project_skills', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }   
    }//END insert_project_skills()

    /* to insert project files */
    function insert_project_files($data = '') {
        $query = $this->db->insert('project_files', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }   
    }//END insert_project_files()

    /* to get urgency */
    public function get_urgency() {
        $this->db->select('*');
        $this->db->from('urgency');
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }//END get_urgency()

    /* to get projects */
    public function get_projects() {
        $this->db->select('project.id,project.name,project.reference_number,project.description,project.created_at,cat.name as category,bud.range_from,bud.range_to, hire_freelancer.freelancer_id as freelancer_id, users_profile.firstname as freelancer_firstname, users_profile.lastname as freelancer_lastname, payment_type, DATE_FORMAT(start_date, "%d %M %Y") as start_date, project_days, total_project_cost', false);
        $this->db->from('projects as project');
        $this->db->join('hire_freelancer', 'project.id = hire_freelancer.project_id', 'LEFT');
        $this->db->join('users_profile', 'hire_freelancer.freelancer_id = users_profile.user_id', 'LEFT');
        $this->db->join('categories as cat', 'cat.id = project.category', 'LEFT');
        $this->db->join('budgets as bud', 'bud.id = project.budget', 'LEFT');
        $this->db->where('project.is_deleted',0);
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {            
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }//END get_projects()

    /* to get tasks */
    public function get_tasks($project_id) {
        $this->db->select('id,name,status');
        $this->db->from('project_tasks');
        $this->db->where('is_deleted',0);
        $this->db->where('project_id',$project_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }//END get_tasks()

    /* to create new task */
    function create_task($data = '') {
        $query = $this->db->insert('project_tasks', $data);
        $task_id = $this->db->insert_id();
        if ($query) {
            return $task_id;
        } else {
            return 0;
        }   
    }//END create_task()
    
    /* delete tasks */
    function delete_task($tasks) {
        $this->db->set('is_deleted', '1');
        $this->db->where_in('id', $tasks);
        $query = $this->db->update('project_tasks');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_task()

    /* to get task */
    public function get_task($task_id) {
        $this->db->select('id,name,status');
        $this->db->from('project_tasks');
        $this->db->where('is_deleted',0);
        $this->db->where('id',$task_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        } else {
            return false;
        }
    }//END get_task()

    public function get_all_bidded_projects($user_id) {
        $this->db->select('pro_project_bids.id as bidder_id, pro_projects.id, pro_projects.user_id as employer, pro_project_bids.user_id as prolancer, pro_users_profile.firstname as first_name, pro_users_profile.lastname as last_name, pro_users_profile.hourly_rate as hourly_rate, users.slug as user_slug, pro_project_bids.bid_amount, pro_project_bids.deliver_days, pro_project_bids.bid_summary, pro_project_bids.skills_summary, pro_project_bids.question_for_employer, pro_projects.name, pro_projects.slug, pro_projects.description, pro_categories.name as category_name, pro_currency.name as currency_name, pro_currency.symbol as currency_symbol, pro_budgets.range_to, pro_budgets.range_from, pro_urgency.days as urgency, (SELECT GROUP_CONCAT(name) as skill_names FROM `pro_project_skills` JOIN pro_skills ON pro_project_skills.skill_id=pro_skills.id WHERE `project_id`=`pro_projects`.`id` AND pro_skills.status=1 AND pro_skills.is_deleted=0) as skill_names, (SELECT GROUP_CONCAT(name) as skill_names FROM `pro_users_skills` JOIN pro_skills ON pro_users_skills.skill_id=pro_skills.id WHERE `user_id`=prolancer AND pro_skills.status=1 AND pro_skills.is_deleted=0 AND pro_users_skills.status=1 AND pro_users_skills.is_deleted=0) as prolancer_skills');
        $this->db->from('project_bids');
        $this->db->join('pro_projects', 'pro_project_bids.project_id = pro_projects.id', 'INNER');
        $this->db->join('pro_categories', 'pro_projects.category = pro_categories.id', 'INNER');
        $this->db->join('pro_budgets', 'pro_projects.budget = pro_budgets.id', 'INNER');
        $this->db->join('pro_currency', 'pro_budgets.currency_id = pro_currency.id', 'INNER');
        $this->db->join('pro_urgency', 'pro_projects.urgency = pro_urgency.id', 'INNER');
        $this->db->join('pro_users', 'pro_project_bids.user_id = pro_users.id', 'INNER');
        $this->db->join('pro_users_profile', 'pro_users.id = pro_users_profile.user_id', 'INNER');


        $this->db->where('pro_projects.user_id', $user_id);
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

        $this->db->where('pro_project_bids.status', 1);
       
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            return $query->result_array();
        } else {
            return false;
        }
    }
}

?>
