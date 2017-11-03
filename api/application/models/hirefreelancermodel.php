<?php

class Hirefreelancermodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to insert hire freelancer */
    function hire_freelancer($data = '') {
        $query = $this->db->insert('hire_freelancer', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }
    }//END hire_freelancer()

    /* to check hire freelancer */
    function check_hire_freelancer($project_id, $freelancer_id) {
        $this->db->select('id');
        $this->db->from('hire_freelancer');
        $this->db->where('project_id', $project_id);
        $this->db->where('freelancer_id', $freelancer_id);
        $this->db->where('payment_status', 0);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->row_array();
        } else {
            return false;
        }
    }//END check_hire_freelancer()

    /* to update hire freelancer */
    function update_hire_freelancer($id, $data = '') {
        $this->db->where('id', $id);
        $query = $this->db->update('hire_freelancer', $data);
        if($query){
            return $id;
        }else{
            return false;
        }
    }//END update_hire_freelancer()

    /* to update payment information */
    function update_payment_info($id, $data = '') {
        $this->db->where('id', $id);
        $query = $this->db->update('hire_freelancer', $data);
        if($query){
            return $id;
        }else{
            return false;
        }
    }//END update_payment_info()        

}

?>


