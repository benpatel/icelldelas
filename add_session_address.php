<?php include_once("includes/initialize.php"); 

$session_name = $_POST['session_name'];
$session_value = $_POST['session_value'];
$table = $_POST['table'];

$_SESSION[$session_name]=$session_value;

$sql = "select * from {$table} where id={$session_value} limit 1";
$result_set = $dtb->query($sql);
while( $result = $result_set->fetch_object()){
	
	$address= array(
        'id'=>$result->id,
        'fname'=>$result->fname,
        'lname'=>$result->lname,
        'company'=>$result->company,        
        'add1'=>$result->add1,
        'add2'=>$result->add2,
        'city'=>$result->city,
        'state'=>$result->state,
        'zip'=>$result->zip
	);
}

$status['status']=1;
$status['address'] = $address;
echo json_encode($status);
?>