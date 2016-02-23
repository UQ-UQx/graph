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
	<link rel="stylesheet" type="text/css" href="www/css/bootstrap.min.css"></link>
	<link rel="stylesheet" type="text/css" href="www/css/bootstrap-theme.min.css"></link>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="www/css/font-awesome.min.css"></link>
	<link rel="stylesheet" type="text/css" href="www/css/jquery-ui.min.css"></link>
	
	<script type="text/javascript" src="www/js/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="www/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="www/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="www/js/twbs-pagination/jquery.twbsPagination.min.js"></script>