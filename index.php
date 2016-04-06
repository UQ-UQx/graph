
<?php require_once('inc/header.php'); ?>

</head>
<body>



	<div id="graph">
		<svg id="chart"></svg>

	</div>

<div id="datasets">
	<form id="upload" method="post" action="scripts/upload.php" enctype="multipart/form-data">
		<div id="drop">
				<span class="fa fa-upload"></span>

			Drop Here

			<a>Browse</a>
			<input type="file" name="upl" multiple/>
		</div>
	</form>
	</div>

</body>
</html>