<?php 

    header('Content-Type: application/json');
    //require_once('available_files.php'); 
    //
    $files = array_slice(scandir('../'.'data/'.$_POST["lti_id"].'/'.$_POST["user_id"].'/'), 2);
    $files = array_diff($files, array($user_id.".csv"));
    error_log(json_encode($files),0);

