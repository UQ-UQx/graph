<?php 
	header('Content-Type: application/json');
	$files = array_slice(scandir('../data/'.$_POST['lti_id']."/".$_POST['user_id']."/"), 2);
	echo json_encode($files);