<?php
include_once("includes/init.php"); 

$email = $_POST['email'];
$password = md5($_POST['password']);


$sql = "select * from buyers where email='{$email}' and password='{$password}' limit 1";
$result_set = $dtb->query($sql);

if($result_set->num_rows ==1){
    
    
    while( $result = $result_set->fetch_object()){
	
	$buyer= array(
        'id'=>$result->id,
        'fname'=>$result->fname,
        'lname'=>$result->lname
        );
        
        $_SESSION['user']['id']=$buyer['id'];
        $_SESSION['user']['fname']=$buyer['fname'];
        $_SESSION['user']['lname']=$buyer['lname'];
        $_SESSION['loged_in']="YES";

}

    if($_SESSION['last_page']==''){
        redirect_to("http://".$_SESSION['2nd_last_page']);
    }else{
        redirect_to("http://".$_SESSION['last_page']);
    }
}
else{
    $_SESSION['login_error']="Email and Password Combination Failed";
    redirect_to("login.php");
}


?>
