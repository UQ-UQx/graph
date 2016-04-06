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
	<?php
	if($lti->is_valid()) {
		echo '<p><span style="color:green">LTI Valid</span> - Dev Version - <span style="color:red">DO NOT USE IN COURSES</span> - contact UQx Technical Team</p>';
	} else {
		echo '<p>LTI Invalid - contact UQx</p>';
		//die();
	}
	?>
	<script src="www/js/bundle.js" type="text/javascript"></script>

	<link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="www/css/style.css">

