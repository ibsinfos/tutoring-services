<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		echo phpinfo(); die();
		$this->load->view('welcome_message');
	}
	public function second()
	{
		$this->load->view('second_text');
	}

		public function send(){

        $fields = array(
            'registration_ids' => 'd__GIgb9ieU:APA91bH8WkD4k0fw6ufwaYuaFL6dOXYo4N3SSwwXZISyRjnJU9sK2_Tz0HSb82thYwfUqUZgH6a7AZp8p__Chjel_8Yk5PYbygeeJxpXyB4VsTip_KTMb5X3jFImCHznJOrQdHABERHN', 
            'notification' => array(
    				'title' => 'findus',
    				'click_action' => 'NOTIFICATION_ACTION',
    				'body' => 'new message',
    				'sound' => 'default' 
    			),
        );

        //print_r($fields); die();

        // eFr6qm4Q_Q4:APA91bHsQE6uvaWbps0pxrCunX7uHfmDECJjzBdiqCyOWsCTenJtrrh_2xSC1YnX62N-rT2Ly66rZJtSUU1GpesvCyQx0y76EajwXnF_Y7GUUpcBpzChDY5PfhVsxP8E-NEpYXs_fOxO
        
        $ch = curl_init();
    	print_r($ch); die();
        curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSLVERSION,3);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: key=AIzaSyBQ3TtiYSo0-6YD4o7SJ3l_Pck0kMrfqY8', 'Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);

        
        if($result === false){
            die('Curl failed: ' . curl_error($ch));
            return false;
        }
        curl_close($ch);
        $response = json_decode($result, true);
        echo '<pre>';print_r($response);
        die('f');
        // if($response['success'] == 1)
        //     return true;
        // 	echo $response;
        // else
        //     return false;
    }
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */