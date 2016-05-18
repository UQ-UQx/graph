
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
 $graph_header = "Query101x Graph";



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

if(isset($ltivars{'custom_graph_header'})){
    $graph_header = $ltivars{'custom_graph_header'};
}



if(isset($ltivars{'custom_upload'})){
	$links = str_getcsv($ltivars{'custom_upload'});
	//echo "<b>Upload: </b> ";
	foreach ($links as $key => $link) {
		download_csv_edx_weblink($link, $lti_id, $user_id);
		//echo $link."<br/>";
	}
	//echo "<br/>";
}


if(isset($ltivars{'custom_pre_load'})){
	// $links = str_getcsv($ltivars{'custom_pre_load'});
	$pre_load = array();
	$pre_load = str_getcsv($ltivars{'custom_pre_load'});

	//echo "<b>Pre Load:</b> ".json_encode($pre_load)."<br/>";
}


 $data_sets = array("Please Upload CSV files with 'Distance' and 'Time'");


 // echo "<br/><b>LTI ID:</b> ".$lti_id;
 // echo "<br/><b>USER ID:</b> ".$user_id;



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

<div class="graph_header_container">
    <span class="graph_header"><?php echo $graph_header; ?></span>
</div>

<div id="graph_container"></div>

<div class="scale_buttons">
  <button class="btn btn-primary btn-sm" data-zoom="+1"><i class="fa fa-search-plus" aria-hidden="true"></i>
&nbsp;&nbsp;&nbsp;Zoom In</button>
  <button class="btn btn-primary btn-sm" data-zoom="-1"><i class="fa fa-search-minus" aria-hidden="true"></i>
&nbsp;&nbsp;&nbsp;Zoom Out</button>
  <button class="btn btn-primary btn-sm" reset-view=''><i class="fa fa-refresh" aria-hidden="true"></i>
&nbsp;&nbsp;&nbsp;Reset View</button>

</div>


<div id="datasets">



	<table id="data_sets_table">
		<thead>
			<th>Data Name</th>
			<th>Show Data</th>
			<th>Show Line of Best Fit</th>
			<th>Edit Data</th>
		</thead>
		<tbody>
			


			<?php 

				foreach ($data_sets as $ind => $value) {
					$value = substr($value,0,-4);
					$display_value = str_replace("_"," ", $value);
					$checked = '';
					if(in_array($value.".csv", $pre_load)){
						$checked = "checked";
					}
					echo "<tr>";


					echo '


				<td>'.$display_value.'</td>
				<td><input class="data_to_load" type="checkbox" name="dataSets" value="'.$value.'" '.$checked.'></td>
				<td><input class="trendline_to_load" type="checkbox" value="'.$value.'" name="dataSets"></td>
				<td><button type="button" class="btn btn-info btn-sm edit_button" data-dataset_display_text="'.$display_value.'" data-dataset_name="'.$value.'" data-toggle="modal" data-target="#myModal"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Edit</button></td>



					';

					echo "</tr>";
	

				}
			?>

<!-- 			<tr>
				<td><button  type="button" class="btn btn-primary add_data_button" data-toggle="modal" data-target="#myModal">Add Dataset</button></td>
			</tr> -->


		</tbody>
	</table>
    <div class="add_data_button_container">
    <button  type="button" class="btn btn-primary btn-block btn-lg add_data_button" data-toggle="modal" data-target="#myModal">Add Dataset</button>
    </div>





	<!-- Modal -->
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">
    

<!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Query101x Graph Data Editor</h4>
        </div>
        <div class="modal-body">
          
          	<div class="modal_data_name_container">
          		

          	</div>

			<div id="table" class="table-editable">
		    <table class="table">
		      <thead>
		        <th><?php echo $x_axis_display_text; ?></th>
		        <th><?php echo $y_axis_display_text; ?></th>
		        <th></th>
		      </thead>
		      
		      <!-- This is our clonable table line -->
		      <tr class="hide">
		        <td contenteditable="true"></td>
		        <td contenteditable="true"></td>
		        <td>
		          <span class="table-remove glyphicon glyphicon-remove"></span>
		        </td>
		      </tr>

		    </table>
 <span class="table-add glyphicon glyphicon-plus"></span>
		  </div>
		  
		  <p id="export"></p>

        </div>
        <div class="modal-footer">
         <div class="bg-danger error_span"></div><br>

        	<button id="export-btn" id="export_button" class="btn btn-primary addexport_buttons"><i class="fa fa-download" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Export Data</button>

          <button type="button" class="btn btn-success addexport_buttons add_button" data-dismiss="modal"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<span></span></button>

          <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Close</button>
        </div>
      </div>



      
    </div>
  </div>









<!-- 
	<form id="upload" method="post" action="scripts/upload.php" enctype="multipart/form-data">

		<input type="hidden" name="user_id" value="<?php echo $user_id; ?>"/>
		<input type="hidden" name="lti_id" value="<?php echo $lti_id; ?>"/>

		<a><span class="fa fa-upload"></span> Browse</a>
		<input type="file" name="upl" multiple/>
		<div id="drop">
		</div>
	</form> -->
</div>

<!-- 
<dl>
  <dt>LTI Call Data</dt><dd><pre><?php print_r($lti->calldata());?></pre></dd>
</dl>
 -->

<script type="text/javascript" src="build/js/app.js"></script>

</body>
</html>