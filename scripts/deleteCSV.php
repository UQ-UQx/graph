<?php  
    header('Content-Type: application/json');

    include 'available_files.php';
    $lti_id = $_POST["lti_id"];
    $user_id = $_POST["user_id"];
    $filename = $_POST["file_name"];
    $dir = $_POST["dir"];
    $path_to_file = '../data/'.$_POST['lti_id'].'/'.$_POST["user_id"].'/'.$dir.'/'.$filename.'.csv';
    unlink($path_to_file);
    echo json_encode($filename);
?>