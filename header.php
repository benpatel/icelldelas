<?php include_once("includes/initialize.php"); 
if(!isset($_SESSION['loged_in'])){
    $_SESSION['loged_in']="NO";
}
?>
<!DOCTYPE html>
<html>
<head>
    <?php include_once("header/page_head.php"); ?> 
</head>
<body class="product-page">
    <?php include_once("header/top_banner.php"); ?> 
<!-- HEADER -->
<div id="header" class="header">
    <?php include_once("header/top_header.php"); ?>  
    <?php include_once("header/main_header.php"); ?>  
    <?php include_once("header/header_menu.php"); ?>
</div>
<!-- end header -->