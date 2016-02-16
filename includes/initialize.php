<?php 
date_default_timezone_set('America/New_York');
require_once("functions.php");
require_once("database.php");
require_once("user.php");
require_once("orders.php");
require_once("product_data.php");

if(isset($_SESSION['last_page']) && $_SESSION['last_page'] !=$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'] && $_SESSION['last_page']!=''){
$_SESSION['2nd_last_page']=$_SESSION['last_page'];
    
}
else{
    $_SESSION['2nd_last_page']= $_SERVER['HTTP_HOST'].'/icelldelas/index.php';
}

$_SESSION['last_page']=$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];   
?>