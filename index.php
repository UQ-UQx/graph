
<?php 

require_once('inc/header.php'); 

 $x_axis_name = "Time (seconds)";
 $y_axis_name = "Distance (meters)";
 $datasets = array("Hacket_2004.csv","Hacket_2006.csv");
 $addable = true;
 $lti_id = $lti->context_id();
 $user_id = $lti->user_id();

 echo $lti_id;
 echo "<br>".$user_id;

 function get_file_names($lti_id,$user_id){
	$data = array('hello' => "world");
	$files = array_slice(scandir('data/'.$lti_id."/".$user_id."/"), 2);
	return $files;
 }

 $data_sets = get_file_names($lti_id,$user_id);


?>

</head>
<body>



	<div id="graph">
		<svg id="chart"></svg>
	</div>

<div id="datasets">

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