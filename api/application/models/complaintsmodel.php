<?php

class Complaintsmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to insert abuse report */
    function insert_complaint($data = '') {
        $query = $this->db->insert('project_complaints', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }
    }//END insert_report()

    function get_complaints($project_id) {
        $this->db->select("id");
        $this->db->from('project_complaints');        
        $this->db->where('project_id', $project_id);        

        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return false;
        }
    }

}

?>
