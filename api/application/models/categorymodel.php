<?php

class Categorymodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    function get_count() {
        $query = $this->db->query('SELECT COUNT(id) as num FROM ts_categories');
        return $query->row()->num;
    }

    /* to create new category */
    function create_category($data = '') {
        $query = $this->db->insert('categories', $data);
        $category_id = $this->db->insert_id();
        if ($query) {
            return $category_id;
        } else {
            return 0;
        }   
    }//END create_category()

    /* to update category */
    function update_category($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('categories', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_category()

    /* to get all parent categories */
    function get_parent_categories($name) {
        $this->db->select('id,name');
        $this->db->from('categories');
        $this->db->where('is_deleted', 0);
        $this->db->where('parent_id', 0);

        if (isset($name) && !empty($name))
            $this->db->like('name', $name);

        $this->db->order_by("category_index", "asc");
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_parent_categories()

    /* to get sub categories for a parent id */
    function get_sub_categories($parent_id) {
        $this->db->select('id,name');
        $this->db->from('categories');
        $this->db->where('is_deleted', 0);
        $this->db->where('parent_id', $parent_id);

        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_sub_categories()

    /* to get all categories */
    public function get_all_categories($data,$request_type) {
        $this->db->select('parent.id,parent.name,parent.parent_id,sub.name as parent_name,parent.created_at,parent.status');
        $this->db->from('categories as parent');
        $this->db->join('categories as sub','parent.parent_id = sub.id','left outer');
        $this->db->where('parent.is_deleted',0);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('parent.name', $data['name']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('parent.created_at', $data['created_at']);

        if (isset($data['parent_name']) && !empty($data['parent_name'])) {
            $this->db->like('parent.name', $data['parent_name']);
            $this->db->where('parent.parent_id != ',0);           
        }

        if (isset($data['status']) && !empty($data['status'])) {
            if($data['status'] == 1) {
                $this->db->where('parent.status', 1);
            } else {
                $this->db->where('parent.status', 0);
            } 
        }
        $this->db->order_by("parent.category_index", "asc");
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
    }//END get_all_categories()

    /* to get category details for an id */
    public function get_category($category_id) {
        $this->db->select('parent.id,parent.name,parent.parent_id,sub.name as parent_name,parent.created_at,parent.status,parent.description');
        $this->db->from('categories as parent');
        $this->db->join('categories as sub','parent.parent_id = sub.id','left outer');
        $this->db->where('parent.is_deleted',0);
        $this->db->where('parent.id', $category_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_category()

    /* delete category from database */
    function delete_category($category_id) {
        $this->db->set('is_deleted', 1);
        $this->db->where('id', $category_id);
        $query = $this->db->update('categories');
        if ($query) {
            $this->db->set('is_deleted', 1);
            $this->db->where('parent_category_id', $category_id);
            $this->db->update('skills');
            return true;
        } else {
            return false;
        }
    }//END delete_category()

    /* change category status  */
    function change_status($category_id, $status) {
        $data = '';
        if ($status == '0') {
            $data = '1';
        } else if ($status == '1') {
            $data = '0';
        }
        $this->db->set('status', $data);
        $this->db->where('id', $category_id);
        $query = $this->db->update('categories');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END change_status()

    function front_get_all_categories() {
        $this->db->select('id, name');
        $this->db->from('categories');
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);        
        $this->db->order_by('category_index');   
        
        $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        } else {
            return false;
        }        
    }

    function front_search_categories($category_name) {
        $this->db->select('id, name');
        $this->db->from('categories');
        $this->db->where('is_deleted', 0);
        $this->db->where('status', 1);
        $this->db->like('name', $category_name);   
        
        $query = $this->db->get();
        if ($query->num_rows()) {
            return $query->result_array();
        } else {
            return false;
        }   
    }
}

?>
