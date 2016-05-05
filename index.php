<?php require_once('inc/header.php'); ?>

</head>
<body>
<?php
	$lti->requirevalid();
?>

<div class="content">
  <h1>Welcome to the LTI base module</h1>

<p>This is an LTI boiler plate built on PHP</p>
<p>You will find that this version now includes the usage of NPM packages, e.g. Browserify, Jquery, Bootstrap ... etc.</p>
<p>If you need any other external libraries, check to see if it exists on the NPM registry and is being maintained</p>


<dl>
  <dt>LTI Call Data</dt><dd><pre><?php print_r($lti->calldata());?></pre></dd>
</dl>

</div>



<!-- Remove this livereload line on production -->
<script src="//localhost:35729/livereload.js"></script>
<!-- Remove this livereload line on production -->
</body>
</html>
