<?php

// A list of permitted file extensions

error_log($_POST["user_id"],0);
error_log($_POST["lti_id"],0);

$allowed = array('csv','tsv');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

	$path = getcwd();
	$oldmask = umask(0);
	if (!file_exists(dirname($path).'/data/'.$_POST["lti_id"])) {
    	mkdir(dirname($path).'/data/'.$_POST["lti_id"], 0777, true);
    	error_log("Creating folder for LTI",0);
	}
	if (!file_exists(dirname($path).'/data/'.$_POST["lti_id"]."/".$_POST["user_id"])) {
    	mkdir(dirname($path).'/data/'.$_POST["lti_id"]."/".$_POST["user_id"], 0777, true);
    	error_log("Creating folder for LTI User",0);
	}
	umask($oldmask);


	$csv=str_getcsv(file_get_contents($_FILES["upl"]["tmp_name"]));

	file_put_contents(dirname($path)."/logs/scripts.log", json_encode($csv));


	$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

	

	$path_to_dir = dirname($path).'/data/'.$_POST["lti_id"]."/".$_POST["user_id"]."/".$_FILES['upl']['name'];

	if(!in_array(strtolower($extension), $allowed)){
		echo '{"status":"error"}';
		exit;
	}

	if(move_uploaded_file($_FILES['upl']['tmp_name'], $path_to_dir)){
		echo '{"status":"success"}';
		exit;
	}
}

echo '{"status":"error"}';
exit;