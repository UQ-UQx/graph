<!DOCTYPE html>
<html lang="en">
<?php
	require_once('config.php');
	require_once('lib/lti.php');
	$lti = new Lti($config,true);
?>
<head>
	<link rel="stylesheet" type="text/css" href="www/css/bootstrap.min.css"></link>
	<link rel="stylesheet" type="text/css" href="www/css/bootstrap-theme.min.css"></link>
	<link rel="stylesheet" type="text/css" href="www/css/font-awesome.min.css"></link>
	
	<script type="text/javascript" src="www/js/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="www/js/bootstrap.min.js"></script>