<?php

class Budgetmodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to create new budget */
    function create_budget($data = '') {
        $query = $this->db->insert('budgets', $data);
        $budget_id = $this->db->insert_id();
        if ($query) {
            return $budget_id;
        } else {
            return 0;
        }   
    }//END create_budget()

    /* to update budget */
    function update_budget($data, $id) {
        $this->db->where('id', $id);
        $query = $this->db->update('budgets', $data);
        if($query){
           return true; 
        }else{
           return false;
        }
    }//END update_budget()

    /* to get all budgets */
    public function get_all_budgets($data,$request_type) {
        $this->db->select('id,name,created_at,status,type');
        $this->db->from('budgets');
        $this->db->where('is_deleted',0);

        if (isset($data['name']) && !empty($data['name']))
            $this->db->like('name', $data['name']);

        if (isset($data['created_at']) && !empty($data['created_at']))
            $this->db->like('created_at', $data['created_at']);

        if (isset($data['type']) && !empty($data['type']))
            $this->db->where('type', $data['type']);

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
            //echo $this->db->last_query();die;
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
    }//END get_all_budgets()

    /* to get budget details for an id */
    public function get_budget($budget_id) {
        $this->db->select('*');
        $this->db->from('budgets');
        $this->db->where('is_deleted',0);
        $this->db->where('id', $budget_id);
        $query = $this->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        }
    }//END get_budget()

    /* delete budget from database */
    function delete_budget($budget_id) {
        $this->db->set('is_deleted', '1');
        $this->db->where('id', $budget_id);
        $query = $this->db->update('budgets');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END delete_budget()

    /* change budget status  */
    function change_status($budget_id, $status) {
        $data = '';
        if ($status == '0') {
            $data = '1';
        } else if ($status == '1') {
            $data = '0';
        }
        $this->db->set('status', $data);
        $this->db->where('id', $budget_id);
        $query = $this->db->update('budgets');
        if ($query) {
            return true;
        } else {
            return false;
        }
    }//END change_status()

    /* to get budget range */
    public function get_budget_range($type) {
        $this->db->select('bud.id,bud.range_from,bud.range_to,currency.id as currency,currency.symbol');
        $this->db->from('budgets as bud');
        $this->db->join('currency', 'currency.id = bud.currency_id', 'left');
        $this->db->where('bud.type',$type);
        $this->db->where('currency.status',1);
        $this->db->where('bud.is_deleted',0);
        $this->db->where('bud.status',1);
        $query = $this->db->get();
        //echo $this->db->last_query();die;
        if ($query) {
            $row = $query->result_array();
            return $row;
        }
    }//END get_budget_range()
}

?>
