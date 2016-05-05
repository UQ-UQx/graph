<!DOCTYPE html>
<html lang="en">
<?php
	require_once('config.php');
	require_once('lib/lti.php');
	$lti = new Lti($config,true);
	if(isset($config['use_db']) && $config['use_db']) {
		require_once('lib/db.php');
		Db::config( 'driver',   'mysql' );
		Db::config( 'host',     $config['db']['hostname'] );
		Db::config( 'database', $config['db']['dbname'] );
		Db::config( 'user',     $config['db']['username'] );
		Db::config( 'password', $config['db']['password'] );
	}
	
?>
<head>

	<link rel="stylesheet" type="text/css" href="build/css/app.min.css"></link>
	<script type="text/javascript" src="build/js/app.js"></script>


	<link rel="stylesheet" type="text/css" 
	href="node_modules/bootstrap/dist/css/bootstrap.min.css"></link>

	<link rel="stylesheet" type="text/css" 
	href="node_modules/font-awesome/css/font-awesome.min.css"></link>

	
<?php
	$dev_message = '<p class="uqx-danger text-center">Dev Version - 
					  DO NOT USE IN COURSES - contact UQx Technical Team</p>';

	$valid_message = '<p class="uqx-valid text-center">LTI Valid</p>';

	$invalid_message = '<p class="uqx-invalid text-center">LTI Invalid 
						- contact UQx Technical Team</p>';

	echo $dev_message;
	if($lti->is_valid()) {
		echo $valid_message;
	} else {
		echo $invalid_message;
		//die();
	}
?>
