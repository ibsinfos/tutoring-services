<?php

class Reasonmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }    

    /* to create new reason */
    function create_reason($data = '') {
        $query = $this->db->insert('violation_reasons', $data);
        $package_id = $this->db->insert_id();
        if ($query) {
            return $package_id;
        } else {
            return 0;
        }   
    }//END create_reason()

    /* to update reason */
    function update_reason($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('violation_reasons', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_reason()

    /* to get all reasons */
    public function get_all_reasons($data, $request_type) {
        $this->db->select('id, name, status, created_at');
        $this->db->from('violation_reasons');
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('name', $data['name']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('created_at', $data['created_at']);

        if (isset($data['status']) && !empty($data['status'])) {
            if($data['status'] == 1) {
                $this->db->where('status', 1);
            } else {
                $this->db->where('status', 0);
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
    }//END get_all_reasons()

    /* to get reason details for an id */
    public function get_reason($reason_id) {
        $this->db->select('id, name, status, created_at');
        $this->db->from('violation_reasons');
        $this->db->where('is_deleted',0);
        $this->db->where('id', $reason_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_reason()    

    /* delete reason from database */
    function delete_reason($reason_id) {
        $this->db->set('is_deleted', '1');
        $this->db->where('id', $reason_id);
        $query = $this->db->update('violation_reasons');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_reason()

    /* change package status  */
    function change_status($reason_id, $status) {
        $data = '';
        if ($status == '0') {
            $data = '1';
        } else if ($status == '1') {
            $data = '0';
        }
        $this->db->set('status', $data);
        $this->db->where('id', $reason_id);
        $query = $this->db->update('violation_reasons');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END change_status()

    function front_get_all_reasons() {
        $this->db->select('id, name');
        $this->db->from('violation_reasons');
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);      
        
        $query = $this->db->get();
        if ($query) {
            return $query->result_array();
        } else {
            return false;
        }        
    }

}

?>
