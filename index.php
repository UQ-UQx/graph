
<?php 

require_once('inc/header.php');
require_once('scripts/available_files.php'); 


 $x_axis_name = "Time (seconds)";
 $y_axis_name = "Distance (meters)";
 $addable = true;
 $lti_id = $lti->context_id();
 $user_id = $lti->user_id();

  $data_sets = array("Please Upload CSV files with 'Distance' and 'Time'");


 echo $lti_id;
 echo "<br>".$user_id;

	$oldmask = umask(0);
	if (!file_exists('data/'.$lti_id)) {
		mkdir('data/'.$lti_id, 0777, true);
		error_log("Creating folder for LTI",0);
	}
	if (!file_exists('data/'.$lti_id."/".$user_id)) {
		mkdir('data/'.$lti_id."/".$user_id, 0777, true);
		error_log("Creating folder for LTI User",0);
	}
	if (!file_exists('data/'.$lti_id."/".$user_id."/".$user_id.".csv")) {
		$myfile = fopen('data/'.$lti_id."/".$user_id."/".$user_id.".csv", "w");
		error_log("Creating main CSV file for User",0);
	}
	umask($oldmask);


 $data_sets = getAvailableFiles($lti_id,$user_id);



?>

<script type="text/javascript">

 $x_axis_name = "<?php echo $x_axis_name; ?>";
 $y_axis_name = "<?php echo $y_axis_name; ?>";
 $user_id = '<?php echo $user_id; ?>';
 $lti_id = '<?php echo $lti_id; ?>';

</script>
</head>
<body>



	<div id="graph">
		<svg id="chart"></svg>
	</div>



<div id="datasets">
<div id="option">
    <input id="updateButton" name="updateButton" type="button" value="Update"/>
</div>


	<ul>

		<?php 

			foreach ($data_sets as $ind => $value) {
			echo "<li>";
			echo '<input class="data_to_load" type="checkbox" name="dataSets" value="'.$value.'"> '.$value;
			echo "</li>";

			}


		?>
	</ul>



	<form id="upload" method="post" action="scripts/upload.php" enctype="multipart/form-data">

		<input type="hidden" name="user_id" value="<?php echo $user_id; ?>"/>
		<input type="hidden" name="lti_id" value="<?php echo $lti_id; ?>"/>

		<div id="drop">
				<span class="fa fa-upload"></span>

			Drop Here

			<a>Browse</a>
			<input type="file" name="upl" multiple/>
		</div>
	</form>
	</div>


<script src="www/js/bundle.js" type="text/javascript"></script>
</body>
</html>