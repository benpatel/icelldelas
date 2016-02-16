<?php include_once("includes/initialize.php"); 
if($_SESSION['loged_in']=="YES"){
    redirect_to($_SESSION['2nd_last_page']);
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
<?php     
$_SESSION['last_page']='';
?>
<!-- page wapper-->
<div class="columns-container">
    <div class="container" id="columns">
        <!-- breadcrumb -->
        <div class="breadcrumb clearfix">
            <a class="home" href="#" title="Return to Home">Home</a>
            <span class="navigation-pipe">&nbsp;</span>
            <span class="navigation_page">Authentication</span>
        </div>
        <!-- ./breadcrumb -->
        <!-- page heading-->
        <h2 class="page-heading">
            <span class="page-heading-title2">Authentication</span>
        </h2>
        <!-- ../page heading-->
        <div class="page-content">
            <div class="row">
                <div class="col-sm-6">
                    <div class="box-authentication">
                        <h3>Create an account</h3>
                        <a href="create-account.php"><button class="button"><i class="fa fa-user"></i> Create an account</button></a>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="box-authentication">
                        <h3>Already registered?</h3>
                        <form action="process_login.php" method="post">
                        <label for="emmail_login">Email address</label>
                        <input id="email" type="text" name="email" class="form-control">
                        <label for="password_login">Password</label>
                        <input id="password_login" type="password" name="password" class="form-control">
                        <p class="forgot-pass"><a href="#">Forgot your password?</a></p>
                        <button class="button" type="submit"><i class="fa fa-lock"></i> Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ./page wapper-->

<?php include_once("footer.php") ?>