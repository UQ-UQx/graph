<?php require_once('inc/header.php');?>
</head>
<body>
<h1>LTI Status</h1>
<h3>This page is a test LTI page to verify the compatibility and status of the LTI connection</h3>
<dl>
	<dt>Status</dt><dd><?php 
		if($lti->is_valid()) {
			echo 'Valid';
		} else {
			echo 'Invalid';
		}
	?></dd>
	<dt>User ID</dt><dd><?php echo $lti->user_id();?></dd>
	<dt>Call Data</dt><dd><pre><?php print_r($lti->calldata());?></pre></dd>
	<dt>Errors</dt><dd><pre><?php print_r($lti->get_errors()); ?></pre></dd>
</dl>
</body>
</html>