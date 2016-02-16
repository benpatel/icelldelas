<?php
include_once("includes/initialize.php"); 

$fname = $_POST['fname'];
$company_name = $_POST['company_name'];
$lname = $_POST['lname'];
$add1 = $_POST['add1'];
$email = $_POST['email'];
$add2 = $_POST['add2'];
$tel = $_POST['tel'];
$city = $_POST['city'];
$pass_confirmation = md5($_POST['pass_confirmation']);
$zip = $_POST['zip'];
$pass = $_POST['pass'];
$state = $_POST['state'];


$sql = "INSERT INTO `showatch_icell`.`buyers` 
    (`id`, `fname`, `lname`, `password`, `email`, `buyer_type`) 
    VALUES 
    (NULL, '{$fname}', '{$lname}', '{$pass_confirmation}', '{$email}', 'consumer')";



$sql1 = "select * from buyers where email='{$email}'";


$result_set1 = $dtb->query($sql1);



if($result_set1->num_rows==0){
    
    $result_set = $dtb->query($sql);
    if($dtb->affected_rows()==1){
        $status['code']=1;
        $status['status']="Account Successfully Created";    
    }else{
        $status['code']='x';
        $status['status']="Database Entry Failed";
    }
    
}
else{
    $status['code']=0;
    $status['status']="Email Already Exist";
}

echo json_encode($status);
?>