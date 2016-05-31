<?php 
    header('Content-Type: application/json');

include 'available_files.php';
error_log(json_encode($_POST),0);


    $lti_id = $_POST["lti_id"];
    $user_id = $_POST["user_id"];
    $filename = $_POST["file_name"];
    $dir = $_POST["dir"];

    $path_to_file = '../data/'.$_POST['lti_id'].'/'.$_POST["user_id"].'/'.$dir.'/'.$filename.'.csv';

    $files_in_dir = getAvailableFilesInDirectory("user",$lti_id,$user_id);

   // for
   // available_files
   // 
    $num_already_exists = 1;

    $existing_files = [];
    foreach ($files_in_dir as $ind => $file) {
        array_push($existing_files, $file["file_name"]);
    }

    $copy_num = 0;

    $checking = true;
    $f = $filename."_copy.csv";

    while($checking){
        if(in_array($f, $existing_files)){
            $copy_num = $copy_num + 1;
            $f = $filename."_copy_".$copy_num.".csv";
        }else{
            if($copy_num == 0){
                $filename = $filename."_copy";
            }else{
                $filename = $filename."_copy_".$copy_num;
            }
            $checking = false;
        }
    }



    $path_to_duplicate = '../data/'.$_POST['lti_id'].'/'.$_POST["user_id"].'/user/'.$filename.".csv";

    if (!copy($path_to_file, $path_to_duplicate)) {
        error_log("Failed to copy $filename");
    }

    echo json_encode($filename);



?>


