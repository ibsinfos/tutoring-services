<?php

class Bidsmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to create new bid */
    function create_bid($data = '', $milestones) {

        $query = $this->db->insert('project_bids', $data);
        $bid_id = $this->db->insert_id();
        if ($query) {

            if(!empty($milestones)) {
                foreach($milestones['amount'] as $key => $milestone) {
                    $mystone['project_id'] = $data['project_id'];
                    $mystone['user_id'] = $data['user_id'];
                    $mystone['amount'] = $milestone;
                    $mystone['description'] = $milestones['description'][$key];

                    $this->create_milestones($mystone);
                }
            }

            return $bid_id;
        } else {
            return 0;
        }   
    } //END create_bid()

    /* to create new milestones */
    function create_milestones($data = '') {
        $query = $this->db->insert('project_milestones', $data);
        $bid_id = $this->db->insert_id();
        if ($query) {
            return $bid_id;
        } else {
            return false;
        }   
    } //END create_milestones()

    /* to update bid */
    function update_bid($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('project_bids', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_bid()

    /* to get all bids */
    public function get_all_bids($project_id) {
        $this->db->select('project_id, project_bids.user_id, bid_amount, deliver_days, bid_summary, skills_summary, question_for_employer, project_bids.created_at, users_profile.firstname, users_profile.lastname');
        $this->db->from('project_bids');
        $this->db->join('users', 'project_bids.user_id = users.id', 'INNER');
        $this->db->join('users_profile', 'users.id = users_profile.user_id', 'INNER');
        $this->db->where('project_id', $project_id);
        $this->db->where('users.status', 1);
        $this->db->where('users.is_deleted', 0);

        $query = $this->db->get();
        if ($query) {
            return $query->result_array();
        } else {
            return false;
        }
    }//END get_all_bids()

    /* delete bid from database */
    function delete_bid($bid_id) {
        $this->db->where('id', $bid_id);
        $query = $this->db->update('project_bids');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_bid()

    /* to get single bid */
    public function get_single_bid($project_id, $user_id) {
        // SELECT `project_id`, pro_project_bids.`user_id`, `bid_amount`, `deliver_days`, `bid_summary`, `skills_summary`, `question_for_employer`, 
        // pro_project_bids.`created_at`, pro_users_profile.firstname, pro_users_profile.lastname FROM (`pro_project_bids`) 
        // JOIN pro_users ON pro_project_bids.user_id=pro_users.id JOIN pro_users_profile on pro_users.id=pro_users_profile.user_id 
        // WHERE `project_id` = '8' AND  pro_project_bids.`user_id` = '3' AND pro_users.status=1 AND pro_users.is_deleted=0

        $this->db->select('project_id, project_bids.user_id, bid_amount, deliver_days, bid_summary, skills_summary, question_for_employer, project_bids.created_at, users_profile.firstname, users_profile.lastname');
        $this->db->from('project_bids');
        $this->db->join('users', 'project_bids.user_id = users.id', 'INNER');
        $this->db->join('users_profile', 'users.id = users_profile.user_id', 'INNER');
        $this->db->where('project_id', $project_id);
        $this->db->where('project_bids.user_id', $user_id);
        $this->db->where('users.status', 1);
        $this->db->where('users.is_deleted', 0);

        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            return $query->row_array();
        } else {
            return false;
        }
    }//END get_single_bid()

    /* to get single bid */
    public function get_avg_bid($project_id) {
        $this->db->select('IFNULL(ROUND(AVG(`bid_amount`)), 0) AS `avgbid`', false);
        $this->db->from('project_bids');
        $this->db->where('project_id', $project_id);        

        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            return $query->row()->avgbid;
        } else {
            return false;
        }
    }//END get_single_bid()


    public function hide_this_project($bidder_id) {
        $this->db->set('status', 0);
        $this->db->where('id', $bidder_id);
        $query = $this->db->update('project_bids');
        if($query){
           return true; 
        }else{
           return false;
        }
    }

    public function decline_project_bid($bidder_id) {
        $this->db->set('status', 0);
        $this->db->set('is_decline', 1);
        $this->db->where('id', $bidder_id);
        $query = $this->db->update('project_bids');
        if($query){
           return true; 
        }else{
           return false;
        }
    }    

    public function talk_to_bidder($data) {
        $query = $this->db->insert('project_messages', $data);
        $message_id = $this->db->insert_id();
        if ($query) {
            return $message_id;
        } else {
            return false;
        }   
    }
    
    public function check_product_slug($project_slug, $user_id) {
        $check = "SELECT * FROM `pro_projects` WHERE user_id=$user_id AND slug='$project_slug' AND is_deleted=0 AND approved=1";
        $checkQuery = $this->db->query($check);

        if($checkQuery) {
            // User and Project Slug is valid
            return $checkQuery->row();
        } else {
            // User and Project Slug is invalid
            return false;
        }        
    }

    public function check_user_slug($user_slug) {
        $check = "SELECT * FROM `pro_users` WHERE slug='$user_slug' AND role_id=3 AND status=1 AND is_deleted=0 AND is_email_verified=1";
        $checkQuery = $this->db->query($check);

        if($checkQuery) {
            // User Slug is valid
            return $checkQuery->row();
        } else {
            // User Slug is invalid
            return false;
        }        
    }   

    public function check_user_biddded_project($project_id, $user_id) {
        $check = "SELECT * FROM `pro_project_bids` WHERE project_id=$project_id AND user_id=$user_id AND is_decline=0 AND status=1";
        $checkQuery = $this->db->query($check);

        if($checkQuery) {
            // Record is valid
            return $checkQuery->row();
        } else {
            // Record is invalid
            return false;
        }        
    }   

    public function update_all_bids($project_id, $freelancer_id) {
        $this->db->set('status', 0);
        $this->db->where('project_id', $project_id);
        $this->db->where('user_id', $freelancer_id);
        $query = $this->db->update('project_bids');
        if($query){
           return true; 
        }else{
           return false;
        }
    }

    

}

?>
