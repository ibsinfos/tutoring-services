<?php

class Abusemodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to insert abuse report */
    function insert_report($data = '') {
        $query = $this->db->insert('project_abuse', $data);
        $insert_id = $this->db->insert_id();
        if ($query) {
            return $insert_id;
        } else {
            return 0;
        }
    }//END insert_report()

    function get_reports($project_id) {
        $this->db->select("project_abuse.id as report_id, violation_reasons.name as reason_name, comments, project_abuse.created_at as report_created, users_profile.user_id, users_profile.firstname, users_profile.lastname, users_profile.profile_image");
        $this->db->from('project_abuse');
        $this->db->join('users_profile', 'project_abuse.user_id = users_profile.user_id', 'INNER');
        $this->db->join('violation_reasons', 'project_abuse.reason = violation_reasons.id', 'INNER');
        $this->db->where('project_id', $project_id);
        $this->db->where('project_abuse.is_deleted', 0);
        $this->db->where('project_abuse.status', 1);

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
