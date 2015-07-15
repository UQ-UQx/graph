<?php require_once('inc/header.php'); ?>

</head>
<body>
<?php
	if(!$lti->is_valid()) {
		echo '<h1>This request is not valid</h1>';
		die();
	}
?>
<h1>Welcome to the LTI base module</h1>
</body>
</html>