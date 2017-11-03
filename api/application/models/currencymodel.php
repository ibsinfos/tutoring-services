<?php

class Currencymodel extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* to update currency */
    function update_currency($id) {
        $this->db->set('status', '1');
        $this->db->where('id', $id);
        $query = $this->db->update('currency');
        if ($query) {
            $this->db->set('status', '0');
            $this->db->where('id !=', $id);
            $update = $this->db->update('currency');
            if($update) {
                return true;
            } else {
                return false;    
            }
        } else {
            return false;
        }
    }//END update_currency()

    /* to get all currencies */
    public function get_all_currencies() {
        $this->db->select('*');
        $this->db->from('currency');
        $query = $this->db->get();
        if ($query) {
            $row = $query->result_array();
            return $row;
        } else {
            return false;
        }
    }//END get_all_currencies()

}

?>
