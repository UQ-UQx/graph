<?php

$path = getcwd();
if(isset($_POST['func'])){
	if($_POST['func'] == "get_filesnames"){
		header('Content-Type: application/json');
		echo json_encode(getAvailableFiles($_POST["lti_id"], $_POST["user_id"]));
	}

    if($_POST['func'] == "get_filesnames_from_script"){

        header('Content-Type: application/json');
        echo json_encode(getAvailableFilesWithPath($_POST["path"], $_POST["lti_id"], $_POST["user_id"]));
    }
  
} 

function getAvailableFiles($lti_id, $user_id){

        $files = array_slice(scandir($_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/'), 2);

    
	$files = array_diff($files, array($user_id.".csv"));
	return $files;
}

function getAvailableFilesWithPath($mypath, $lti_id, $user_id){

    $files = array_slice(scandir($mypath.'data/'.$lti_id.'/'.$user_id.'/'), 2);
    $files = array_diff($files, array($user_id.".csv"));
    return $files;
}



 