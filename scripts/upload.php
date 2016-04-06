<?php

// A list of permitted file extensions

// require_once('../config.php');
// require_once('../lib/lti.php');
// $lti = new Lti($config,true);

// error_log("Oracle database not available! - ".$lti->user_id(), 0);



$allowed = array('csv','tsv');

if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

	$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);
	$path = getcwd();


	if(!in_array(strtolower($extension), $allowed)){
		echo '{"status":"error"}';
		exit;
	}

	if(move_uploaded_file($_FILES['upl']['tmp_name'], dirname($path).'/data/'.$_FILES['upl']['name'])){
		echo '{"status":"success"}';
		exit;
	}
}

echo '{"status":"error"}';
exit;