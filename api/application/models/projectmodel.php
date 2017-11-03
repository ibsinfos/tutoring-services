<?php

class Projectmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to get all project */
    public function get_all_projects($data,$request_type) {
        $this->db->select('project.id,project.name,project.created_at,project.status,project.description,cat.id as category_id,cat.name as category_name,project.type,project.approved');
        $this->db->from('projects as project');
        $this->db->join('categories as cat','cat.id = project.category','left');
        $this->db->where('project.is_deleted',0);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('project.name', $data['name']);

        if (isset($data['category']) && !empty($data['category']))
            $this->db->like('cat.name', $data['category']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('project.created_at', $data['created_at']);

        if (isset($data['status']) && !empty($data['status'])) {
            if($data['status'] == 1) {
                $this->db->where('project.status', 1);
            } else {
                $this->db->where('project.status', 0);
            } 
        }

        

        if($request_type == 1) {
            $this->db->limit($data['limit'], $data['start']);
            $query = $this->db->get();
            if ($query) {
                $row = $query->result_array();
                return $row;
            }
        } else {
            $query = $this->db->get();
            if ($query) {
                $row = $query->num_rows();
                return $row;
            }
        }
    }//END get_all_projects()

    /* to get project details for an id */
    public function get_project($project_id) {
        $this->db->select('project.id,project.name,project.created_at,project.status,project.description,cat.id as category_id,cat.name as category_name,project.type,user.firstname,user.lastname,project.approved,project.user_id,project.urgency,project.budget');
        $this->db->from('projects as project');
        $this->db->join('categories as cat','cat.id = project.category','left');
        $this->db->join('users_profile as user','user.user_id = project.user_id','left');
        $this->db->where('project.id', $project_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_project()

    /* to get project details for an id */
    public function get_files($project_id) {
        $this->db->select('*');
        $this->db->from('project_files');
        $this->db->where('project_id', $project_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_files()

    /* to approve project  */
    public function approve_project($project_id) {
        $this->db->set('approved', 1);
        $this->db->where('id', $project_id);
        $query = $this->db->update('projects');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END approve_project()

    /* delete project from database */
    function delete_project($project_id) {
        $this->db->set('is_deleted', 1);
        $this->db->where('id', $project_id);
        $query = $this->db->update('projects');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_project()

    /* to get project skills for an id */
    public function get_project_skills($project_id) {
        $this->db->select('pro_projects.id, pro_projects.name,pro_project_skills.id as project_skill_id,pro_skills.name as skill_name,pro_project_skills.category_id');
        $this->db->from('projects');
        $this->db->join('pro_project_skills','pro_project_skills.project_id = pro_projects.id','left');
        $this->db->join('pro_skills','pro_skills.id = pro_project_skills.skill_id','left');
        $this->db->where('pro_projects.id', $project_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_project_skills()

    /* to insert review and rating */
    function insert_review_rating($data = '') {
        $query = $this->db->insert('review_rating', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        }   
    }//END insert_review_rating()

    /* to update review rating */
    function update_review_rating($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('review_rating', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_review_rating()

    public function get_max_reference_number() {
        $this->db->select_max('reference_number');
        $this->db->from('projects');
        $result = $this->db->get()->row();  
        return $result->reference_number;
    }

    /* to get all review and ratings */
    public function get_all_review_ratings($user_id,$type) {
        $this->db->select('review_rating.*,projects.name as project_name');
        $this->db->from('review_rating');
        $this->db->join('projects','projects.id = review_rating.project_id','left');
        if($type == 2) {
            $this->db->where('review_rating.sender_id', $user_id);
        } else {
            $this->db->where('review_rating.receiver_id', $user_id);
        }
        $this->db->where('review_rating.is_deleted', 0);
        $this->db->where('review_rating.status', 1);
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_all_review_ratings()

    /* to get review and ratings by a id*/
    public function get_review_ratings($id) {
        $this->db->select('*');
        $this->db->from('review_rating');
        $this->db->where('id', $id);
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_review_ratings()

}

?>