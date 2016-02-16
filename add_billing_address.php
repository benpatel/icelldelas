<?php include_once("includes/initialize.php"); 



$fname = $_POST['fname'];
$company_name = $_POST['company_name'];
$lname = $_POST['lname'];
$add1 = $_POST['add1'];
$add2 = $_POST['add2'];
$city = $_POST['city'];
$zip = $_POST['zip'];
$state = $_POST['state'];
$buyer_id = $_POST['buyer_id'];


$sql = "INSERT INTO `showatch_icell`.`billing` 
    (`id`, `fname`, `lname`, `company`, `add1`, `add2`,`state`,`zip`,`city`,`buyer_id`) 
    VALUES 
    (NULL, '{$fname}', '{$lname}', '{$company_name}', '{$add1}', '{$add2}', '{$city}', '{$zip}', '{$state}', '{$buyer_id}')";



 $result_set = $dtb->query($sql);

if($dtb->affected_rows()==1){
        $status['code']=1;
        $status['status']="Address Created";    
    }else{
        $status['code']='x';
        $status['status']="Database Entry Failed";
    }



echo json_encode($status);
?>
