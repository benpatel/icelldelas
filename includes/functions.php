<?php
include_once("database.php");
 function curPageURL() {
 $pageURL = $_SERVER["REQUEST_URI"];
 $pos1 = strrpos($pageURL,'.');
 $pos2 = strrpos($pageURL,'/');
 $pos3 = $pos1-$pos2;
 $pageURL = substr("$pageURL", $pos2+1,$pos3-1); 
 return $pageURL;
 }
 
 function curPageFULLURL() {
 $pageURL = 'http';
 $pageURL .= "://";
 if ($_SERVER["SERVER_PORT"] != "80") {
  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
 } else {
  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
 }
 return $pageURL;
 }
 
 function redirect_to($location = NULL){
 if($location!=NULL)
			{	unset($_SESSION['prev']);
				header("location:{$location}");
				exit;
			}
 }
	
 function dateconvert($date,$func) {
 

$mo_name = array('Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec');

$months_no = array('jan'=>'01',
				   'feb'=>'02',
				   'mar'=>'03',
				   'apr'=>'04',
				   'may'=>'05',
				   'june'=>'06',
				   'july'=>'07',
				   'aug'=>'08',
				   'sep'=>'09',
				   'oct'=>'10',
				   'nov'=>'11',
				   'dec'=>'12');

if ($func == 1){ //insert conversion
list($year, $month, $day) = explode('/', $date);
$date = "$year-$month-$day";
return $date;
}
if ($func == 2){ //output conversion
list($year, $month, $day) = explode('-', $date);
$date = "$year/$month/$day";
return $date;
}

if ($func == 3){ //output conversion
list($year, $month, $day) = explode('-', $date);

$date = $day." ".$mo_name[$month-1];
return $date;
}
if ($func == 4){ //output conversion
list($year, $month, $day) = explode('-', $date);
$date = "$month/$day/$year";
return $date;
}

if ($func == 5){ //output conversion
list($year, $month, $day) = explode('-', $date);

$date =$mo_name[$month-1]." ".$year;
return $date;
}
if ($func == 6){ //insert conversion	
list($year, $month, $day) = explode('/', $date);
$date = "$month-$day-$year";
return $date;
}

if ($func == 7){ //output conversion
list($year, $month, $day) = explode('-', $date);

$date =$day." ".$mo_name[$month-1]." , ".$year;
return $date;
}


if ($func == 8){ //insert conversion	
list($month, $day, $year) = explode('-', $date);
$month = strtolower($month);
$date = "20$year-$months_no[$month]-$day";
return $date;
}

}

function get_day_left($dt1,$dt2){

list($y1, $m1, $d1) = explode('-', $dt1);
list($y2, $m2, $d2) = explode('-', $dt2);

$start =  mktime(0,0,0,$m1,$d1,$y1);
$end =  mktime(0,0,0,$m2,$d2,$y2);

$day = floor(($end-$start)/86400);

return $day;
 }

?>