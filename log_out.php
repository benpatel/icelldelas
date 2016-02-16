<?php
include_once("includes/init.php"); 

        unset($_SESSION['user']);
        $_SESSION['loged_in']="NO";

if($_SESSION['last_page']==''){
        redirect_to("http://".$_SESSION['2nd_last_page']);
    }else{
        redirect_to("http://".$_SESSION['last_page']);
    }

?>