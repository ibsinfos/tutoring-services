<?php
    
    /* to get active currency */
    function getActiveCurrency() {
        $CI = get_instance();
        $CI->db->select('*');
        $CI->db->from('currency');
        $CI->db->where('status', 1);
        $query = $CI->db->get();
        if ($query) {
            $row = $query->row_array();
            return $row;
        } else {
            return false;
        }
    }//END getActiveCurrency()

    /* check validations */
    function checkValidation($fields) {
        $error_message = array();
        foreach ($fields as $field) {
            if (form_error($field)) {
                $error = form_error($field);
                $error_message[$field] = $error;
            }
        }
        return $error_message;
    }//END checkValidation()
    
    /* upload files */
    function uploadFile($file_name, $config) {

        $return = array("result" => "error", "msg" => "");
        if (!isset($config["upload_path"])) {
            return $return;
        }
    
        $CI = & get_instance();
    
        if (!isset($config["allowed_types"])) {
            $config["allowed_types"] = "gif|jpg|png|jpeg|JPG|JPG|GIF|PNG|JPEG";
        }
        if (!isset($config["encrypt_name"])) {
            $config["encrypt_name"] = TRUE;
        }
    
        $CI->load->library('upload');
        $CI->upload->initialize($config);
    
        if ($CI->upload->do_upload($file_name)) {
            $data = $CI->upload->data();
            $return["file"] = $data["file_name"];
            $return["result"] = "success";
            $return["data"] = $data;
        } else {
            $return["msg"] = $CI->upload->display_errors();
            $return["result"] = "error";
        }
        return $return;
    }//END uploadFile()


    function resize_image($image, $width = FALSE, $height = FALSE, $path = FALSE) {
        if (!$width) {
            return FALSE;
        }
        $CI = & get_instance();
        $resize['image_library'] = 'gd2';
        $resize['source_image'] = $image;
        if ($path) {
            $resize['new_image'] = $path;
        }
        //$resize['create_thumb'] = TRUE;
        $resize['maintain_ratio'] = TRUE;
        $resize['width'] = $width;
        $resize['height'] = $height;
        $CI->load->library('image_lib', $resize);
        //$CI->image_lib->initialize($resize);
        return $CI->image_lib->resize();
    }//END resize_image()

?>