<?php

function sendMail($to, $msg, $subject) {
    $config['protocol'] = 'smtp';
    $config['smtp_host'] = 'ssl://smtp.gmail.com';
    $config['smtp_port'] = '465';
    $config['smtp_timeout'] = '7';
    $config['smtp_user'] = 'shifali.s@cisinlabs.com';
    $config['smtp_pass'] = 'tXOb6rghu1';
    $config['charset'] = "utf-8";
    $config['newline'] = "\r\n";
    $config['crlf'] = "\r\n";
    $config['mailtype'] = "html";
    $config['wordwrap'] = TRUE;
    $ci = get_instance();
    $ci->load->library('email');
    $ci->email->initialize($config);
    $ci->email->from('mike@mailinator.com', 'Prolance');
    $ci->email->to($to);
    $ci->email->subject($subject);
    $ci->email->message($msg);
    if ($ci->email->send()) {
        return true;
    } else {
        return false;
    }
}

?>