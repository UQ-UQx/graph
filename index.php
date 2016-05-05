
<?php 

require_once('inc/header.php');
require_once('scripts/available_files.php');
require_once('scripts/download_csv.php'); 


 $x_axis = "Time";
 $y_axis = "Distance";
 $x_axis_display_text = "Time (seconds)";
 $y_axis_display_text = "Distance (meters)";
 $x_axis_format = "none";
 $y_axis_format = "none";

 $editable = true;
 $lti_id = $lti->context_id()."_".$lti->resource_id();
 $user_id = $lti->user_id();
 $pre_load = array();



$ltivars = $lti->calldata();

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



if(isset($ltivars{'custom_x_axis_display_text'})){
	$x_axis_display_text = $ltivars{'custom_x_axis_display_text'};
}

if(isset($ltivars{'custom_y_axis_display_text'})){
	$y_axis_display_text = $ltivars{'custom_y_axis_display_text'};
}


if(isset($ltivars{'custom_x_axis'})){
	$x_axis = $ltivars{'custom_x_axis'};
}

if(isset($ltivars{'custom_y_axis'})){
	$y_axis = $ltivars{'custom_y_axis'};
}


if(isset($ltivars{'custom_x_axis_format'})){
	$x_axis_format = $ltivars{'custom_x_axis_format'};
}

if(isset($ltivars{'custom_y_axis_format'})){
	$y_axis_format = $ltivars{'custom_y_axis_format'};
}



if(isset($ltivars{'custom_upload'})){
	$links = str_getcsv($ltivars{'custom_upload'});
	foreach ($links as $key => $link) {
		download_csv_edx_weblink($link, $lti_id, $user_id);
	}
}


if(isset($ltivars{'custom_pre_load'})){
	// $links = str_getcsv($ltivars{'custom_pre_load'});
	$pre_load = array();
	$pre_load = str_getcsv($ltivars{'custom_pre_load'});

	echo $pre_load;
}


 $data_sets = array("Please Upload CSV files with 'Distance' and 'Time'");


 echo $lti_id;
 echo "<br>".$user_id;



 $data_sets = getAvailableFiles($lti_id,$user_id);



?>

<script type="text/javascript">

 $x_axis = "<?php echo $x_axis; ?>";
 $y_axis = "<?php echo $y_axis; ?>";
 $x_axis_display_text = "<?php echo $x_axis_display_text; ?>";
 $y_axis_display_text = "<?php echo $y_axis_display_text; ?>";

 $x_axis_format = "<?php echo $x_axis_format; ?>";
 $y_axis_format = "<?php echo $y_axis_format; ?>";
 $user_id = '<?php echo $user_id; ?>';
 $lti_id = '<?php echo $lti_id; ?>';
 $pre_load = JSON.parse('<?php echo json_encode($pre_load); ?>');
 $init_available_data_sets = JSON.parse('<?php echo json_encode($data_sets); ?>');

</script>
</head>
<body>


		<div id="graph">
			<svg id="chart"></svg>
		</div>



<div id="datasets">
<div id="option">
 <!--   <input id="updateButton" name="updateButton" type="button" value="Update"/> -->
</div>


	<ul>
		<?php 

			foreach ($data_sets as $ind => $value) {
			$value = substr($value,0,-4);
			$display_value = str_replace("_"," ", $value);
			$checked = '';
			if(in_array($value.".csv", $pre_load)){
				$checked = "checked";
			}
			echo "<li>";
			echo '<input class="data_to_load" type="checkbox" name="dataSets" value="'.$value.'" '.$checked.'> '.$display_value;
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


<dl>
  <dt>LTI Call Data</dt><dd><pre><?php print_r($lti->calldata());?></pre></dd>
</dl>


<script type="text/javascript" src="build/js/app.js"></script>

<!-- Remove this livereload line on production -->
<script src="//localhost:35729/livereload.js"></script>
<!-- Remove this livereload line on production -->
</body>
</html>