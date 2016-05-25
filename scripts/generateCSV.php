<?php 

    header('Content-Type: application/json');
    //require_once('available_files.php'); 
    //
    
    $file = '../data/'.$_POST['lti_id'].'/'.$_POST["user_id"].'/user/'.$_POST["filename"];
    // Open the file to get existing content
    // Append a new person to the file
    $current .= $_POST["csvstring"];
    // Write the contents back to the file
    file_put_contents($file, $current);

    error_log(json_encode($_POST["csvstring"]),0);

    echo json_encode("success");

