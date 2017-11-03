<?php

class Packagemodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    function get_all_tags() {
        $this->db->select('*');
        $this->db->from('key_tags');
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }//END get_all_tags()

    /* to create new package */
    function create_package($data = '') {
        $query = $this->db->insert('packages', $data);
        $package_id = $this->db->insert_id();
        if ($query) {
            return $package_id;
        } else {
            return 0;
        }   
    }//END create_package()

    /* to update package */
    function update_package($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('packages', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_package()

    /* to get all packages */
    public function get_all_packages($data,$request_type) {
        $this->db->select('package.id,package.name,package.amount,package.status');
        $this->db->from('packages as package');
        $this->db->where('package.is_deleted',0);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('package.name', $data['name']);

        if (isset($data['amount']) && !empty($data['amount']))
            $this->db->like('package.amount', $data['amount']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('package.created_at', $data['created_at']);

        if (isset($data['status']) && !empty($data['status'])) {
            if($data['status'] == 1) {
                $this->db->where('package.status', 1);
            } else {
                $this->db->where('package.status', 0);
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
    }//END get_all_packages()

    /* to get package details for an id */
    public function get_package($package_id) {
        $this->db->select('package.id,package.name,package.amount,package.status,package.description,package.key_tags');
        $this->db->from('packages as package');
        $this->db->where('package.is_deleted',0);
        $this->db->where('package.id', $package_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_package()

    /* to get tag */
    public function get_tags($arr) {
        $this->db->select('*');
        $this->db->from('key_tags');
        $this->db->where_in('id', $arr);
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_tags()

    /* delete package from database */
    function delete_package($package_id) {
        $this->db->set('is_deleted', '1');
        $this->db->where('id', $package_id);
        $query = $this->db->update('packages');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_package()

    /* change package status  */
    function change_status($package_id, $status) {
        $data = '';
        if ($status == '0') {
            $data = '1';
        } else if ($status == '1') {
            $data = '0';
        }
        $this->db->set('status', $data);
        $this->db->where('id', $package_id);
        $query = $this->db->update('packages');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END change_status()

}

?>
