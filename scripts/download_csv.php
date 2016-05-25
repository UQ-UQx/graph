<?php


//edge.edx.org/asset-v1:UQx+UQx002+2015August+type@asset+block@Hacket_2004.csv
function download_csv_edx_weblink($url, $lti_id, $user_id){
	$path = $_SERVER['DOCUMENT_ROOT'].$_SERVER["REQUEST_URI"].'data/'.$lti_id.'/'.$user_id.'/default/';
	$pieces = explode("@", $url);
	$file_name = $pieces[count($pieces)-1];
	file_put_contents($path.$file_name, file_get_contents("https://".$url));
	return $file_name;
}
