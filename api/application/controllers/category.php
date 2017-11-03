<?php
defined('BASEPATH') OR exit('No direct script access allowed');
header("Access-Control-Expose-Headers: Access-token,total_categories");
/**
 * for webservice
 */
// This can be removed if you use __autoload() in config.php OR use Modular Extensions

require APPPATH . 'libraries/REST_Controller.php';

class Category extends REST_Controller {

    function __construct() {
        parent::__construct();        
        $this->load->model('categorymodel');
        $this->load->helper('common_helper');
    }

    /* to save category data */
    public function save_post() {
        $this->form_validation->set_rules('name', 'Name', 'trim|xss_clean|required');
        if ($this->form_validation->run() == FALSE) {
            $array = array('name');
            $myValid = checkValidation($array);
            http_response_code(401);
            $response = array('status' => 0, 'error' => $myValid);
        } else {
            $data = array( 
                'parent_id' => $this->post('parent_id'),
                'name' => $this->post('name'),
                'description' => $this->post('description'),
            );
            if($this->post('category_id')){
                $categoryId = $this->post('category_id');
                $result = $this->categorymodel->update_category($data,$categoryId);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Category updated successfully!');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            } else {
                $data['created_at'] = date('Y-m-d H:i:s');
                $result = $this->categorymodel->create_category($data);
                if ($result) {
                    $response = array('status' => 1, 'message' => 'Catergory created successfully');
                } else {
                    http_response_code(401);
                    $response = array('status' => 0, 'error' => 'Something went wrong!');
                }
            }
        }
        echo json_encode($response); 
        exit();
    }//END save()

    /* to get list of all categories */
    public function list_get(){
        $pageNum = $this->get('pageNum');
        $limit = 10;
        $start = $limit * $pageNum - $limit;

        $data = array(
            'name' => $this->get('name'),
            'created_at' => $this->get('created_at'),
            'parent_name' => $this->get('parent_name'),
            'status' => $this->get('status') * 1,
            'start' => $start,
            'limit' => $limit
        );
        $result = $this->categorymodel->get_all_categories($data,1);
        if ($result) {
            $count = $this->categorymodel->get_all_categories($data,0);
            $response = array('status' => 1, 'categories' => $result);
            header('total_categories:' . $count);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END list()

    /* to delete a category */
    public function delete_post(){
        $categoryId = $this->post('category_id');
        if ($categoryId) {
            $result = $this->categorymodel->delete_category($categoryId);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Category deleted successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END delete()

    /* get parent categories */
    public function parentCategories_get() {
        $name = $this->get('name');
        $result = $this->categorymodel->get_parent_categories($name);
        if ($result) {
            $response = array('status' => 1, 'parent_categories' => $result);
        } else {
            http_response_code(200);
            $response = array('status' => 0, 'error' => 'No record found!');
        }
        echo json_encode($response);
        exit();
    }//END parentCategories()

    /* get sub categories for a parent id */
    public function subCategories_get() {
        $parentId = $this->get('parent');
        if($parentId) {
            $result = $this->categorymodel->get_sub_categories($parentId);
            if ($result) {
                $response = array('status' => 1, 'sub_categories' => $result);
            } else {
                http_response_code(200);
                $response = array('status' => 0, 'error' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END subCategories()

    /* get category information for a id */
    public function categoryInfo_get() {
        $categoryId = $this->uri->segment(2);
        if ($categoryId) {
            $category = $this->categorymodel->get_category($categoryId);
            if ($category) {
                http_response_code(200);
                $response = array('status' => 1, 'category' => $category);
            } else {
                http_response_code(401);
                $response = array('status' => 0, 'error' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'No record found!!');
        }
        echo json_encode($response);
        exit();
    }//END categoryData()

    /* change active/inactive status of category */
    public function changeStatus_post() {
        $categoryId = $this->post('category_id');
        if ($categoryId) {
            $status = $this->post('status');
            $result = $this->categorymodel->change_status($categoryId, $status);
            if ($result) {
                $response = array('status' => 1, 'message' => 'Category updated successfully!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        echo json_encode($response);
        exit();
    }//END changeStatus()

    public function frontGetCategories_get() {
        $result = $this->categorymodel->front_get_all_categories();
                
        if ($result) {            
            $response = array('status' => 1, 'message' => 'Categories found!', 'categories' => $result);
        } else {            
            $response = array('status' => 0, 'message' => 'No record found!');
        }
        
        http_response_code(200);
        echo json_encode($response);
        exit();
    }

    public function frontSearchCategories_get() {
        $name = $this->get('name');
        if (!empty($name)) {
            $result = $this->categorymodel->front_search_categories($name);
            http_response_code(200);
            if ($result) {                
                $response = array('status' => 1, 'message' => 'Categories found!', 'categories' => $result);
            } else {
                $response = array('status' => 0, 'message' => 'No record found!');
            }
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'message' => 'Category Name is required!');
        }      
          
        echo json_encode($response);
        exit();
    }

    public function updateCategoryOrder_post(){
        if($this->input->post('data') != '') {
            $category = json_decode($this->input->post('data'), true);
            foreach ($category as $value) {
                $this->categorymodel->update_category($value,$value['id']);
            }
            $response = array('status' => 1, 'message' => 'Category order updated successfully!');
        } else {
            http_response_code(401);
            $response = array('status' => 0, 'error' => 'Something went wrong!');
        }
        
        echo json_encode($response);
        exit();
    }

}

?>
