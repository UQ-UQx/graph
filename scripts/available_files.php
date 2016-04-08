<?php

$path = getcwd();
if(isset($_POST['func'])){
	if($_POST['func'] == "get_filesnames"){
		header('Content-Type: application/json');
		echo json_encode(getAvailableFiles($_POST["lti_id"], $_POST["user_id"]));
	}
} 
function getAvailableFiles($lti_id, $user_id){
	$files = array_slice(scandir($_SERVER['DOCUMENT_ROOT'].'/query101x/graph/data/'.$lti_id.'/'.$user_id.'/'), 2);
	$files = array_diff($files, array($user_id.".csv"));
	return $files;
}

 