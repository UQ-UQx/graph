<?php 
	header('Content-Type: application/json');
	require_once('available_files.php'); 
	$files = getAvailableFiles($_POST['lti_id'],$_POST['user_id']);
	echo json_encode($files);