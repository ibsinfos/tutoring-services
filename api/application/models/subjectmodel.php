<?php

class Subjectmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    function get_count() {
        $query = $this->db->query('SELECT COUNT(id) as num FROM ts_subjects');
        return $query->row()->num;
    }

    /* to create new subject */
    function create_subject($data = '') {
        $query = $this->db->insert('subjects', $data);
        $subject_id = $this->db->insert_id();
        if ($query) {
            return $subject_id;
        } else {
            return 0;
        }   
    }//END create_subject()

    /* to update subject */
    function update_subject($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('subjects', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_subject()

    /* to get all subjects */
    public function get_all_subjects($data,$request_type) {
        $this->db->select('subject.id, subject.name, subject.created_at, subject.status, parent.id as parent_id, parent.name as parent_name');
        $this->db->from('subjects as subject');
        $this->db->join('categories as parent','parent.id = subject.parent_category_id','left');
        $this->db->where('subject.is_deleted',0);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('subject.name', $data['name']);

        if (isset($data['parent_cat']) && !empty($data['parent_cat']))
            $this->db->like('parent.name', $data['parent_cat']);

        if (isset($data['sub_cat']) && !empty($data['sub_cat']))
            $this->db->like('sub.name', $data['sub_cat']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('subject.created_at', $data['created_at']);

        if (isset($data['status']) && !empty($data['status'])) {
            if($data['status'] == 1) {
                $this->db->where('subject.status', 1);
            } else {
                $this->db->where('subject.status', 0);
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
    }//END get_all_subjects()

    /* to get subject details for an id */
    public function get_subject($subject_id) {
        $this->db->select('subject.id,subject.name,subject.created_at,subject.status,parent.id as parent_id,parent.name as parent_name');
        $this->db->from('subjects as subject');
        $this->db->join('categories as parent','parent.id = subject.parent_category_id','left');
        $this->db->where('subject.is_deleted',0);
        $this->db->where('subject.id', $subject_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_subject()

    /* delete subject from database */
    function delete_subject($subject_id) {
        $this->db->set('is_deleted', '1');
        $this->db->where('id', $subject_id);
        $query = $this->db->update('subjects');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_subject()

    /* change subject status  */
    function change_status($subject_id, $status) {
        $data = '';
        if ($status == '0') {
            $data = '1';
        } else if ($status == '1') {
            $data = '0';
        }
        $this->db->set('status', $data);
        $this->db->where('id', $subject_id);
        $query = $this->db->update('subjects');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END change_status()


    function front_get_subjects($category_id) {
        $this->db->select('id, name, parent_category_id');
        $this->db->from('subjects');
        $this->db->where('parent_category_id', $category_id);  
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);
        $this->db->order_by('name');   
        
        $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        } else {
            return false;
        }   
    }

    function front_search_subjects($subject_name) {
        $this->db->select('id, name, parent_category_id');
        $this->db->from('subjects');
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);
        $this->db->like('name', $subject_name);   
        
        $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        } else {
            return false;
        }   
    }

}

?>
