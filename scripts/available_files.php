<?php

$path = getcwd();
if(isset($_POST['func'])){
	if($_POST['func'] == "get_filesnames"){
		header('Content-Type: application/json');
		echo json_encode(getAvailableFiles($_POST["lti_id"], $_POST["user_id"]));
	}

    if($_POST['func'] == "get_filesnames_from_script"){

        header('Content-Type: application/json');
        echo json_encode(getAvailableFilesWithPath($_POST["path"], $_POST["lti_id"], $_POST["user_id"]));
    }
  
} 

function getAvailableFiles($lti_id, $user_id){

    //$files = array_slice(scandir($_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/'), 2);
    $dir = $_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/default/';

    
  
    $dirs["default"] = $_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/default/';
    $dirs["user"] = $_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/user/';

    $files = [];
    foreach ($dirs as $dir_name => $dir_path) {


        if (is_dir($dir_path)) {
            if ($dh = opendir($dir_path)) {
                while (($file = readdir($dh)) !== false) {
                    if (strpos($file, '.csv') !== false) {
                        // error_log(json_encode($file),0);

                        $f["file_name"] = $file;
                        $f["directory"] = $dir_name;
                        //error_log(json_encode($f),0);

                        array_push($files, $f);
                    }
                }
                closedir($dh);
            }
        }



    }

    //error_log(json_encode($files),0);

	return $files;
}

function getAvailableFilesInDirectory($dir, $lti_id, $user_id){


    //$files = array_slice(scandir($_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/'), 2);


  
    $dirs[$dir] = '../data/'.$_POST['lti_id'].'/'.$_POST["user_id"].'/'.$dir;

    $files = [];
    foreach ($dirs as $dir_name => $dir_path) {


        if (is_dir($dir_path)) {

            if ($dh = opendir($dir_path)) {

                while (($file = readdir($dh)) !== false) {


                    if (strpos($file, '.csv') !== false) {
                        // error_log(json_encode($file),0);

                        $f["file_name"] = $file;
                        $f["directory"] = $dir_name;
                        //error_log(json_encode($f),0);

                        array_push($files, $f);
                    }
                }
                closedir($dh);
            }
        }


    }

    //error_log(json_encode($files),0);

    return $files;


}

function getAvailableFilesWithPath($mypath, $lti_id, $user_id){

    $files = array_slice(scandir($mypath.'data/'.$lti_id.'/'.$user_id.'/user/'), 2);
    $files = array_diff($files, array($user_id.".csv"));
    return $files;
}



 