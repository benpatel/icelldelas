<?php include_once("includes/initialize.php"); 
if($_SESSION['loged_in']=="YES"){
    redirect_to("index.php");
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
<!-- page wapper-->
<div class="columns-container">
    <div class="container" id="columns">
        <!-- breadcrumb -->
        <div class="breadcrumb clearfix">
            <a class="home" href="#" title="Return to Home">Home</a>
            <span class="navigation-pipe">&nbsp;</span>
            <span class="navigation_page">Register</span>
        </div>
        <!-- ./breadcrumb -->
        <!-- page heading-->
        <h2 class="page-heading">
            <span class="page-heading-title2">Register</span>
        </h2>
        <!-- ../page heading-->
        <div class="page-content">
            <div class="row">
             
                
                
            <div class="box-border">
                <form id="register_form" action="" method="post">
                <ul>
                    <li class="row">
                        <div class="col-sm-6">
                            <label for="first_name" class="required">First Name</label>
                            <input type="text" class="input form-control"  data-validation="required"  data-validation-error-msg="Please Enter First Name" name="fname" id="bill_first_name">
                        </div><!--/ [col] -->
                        
                        <div class="col-sm-6">
                            <label for="company_name">Company Name</label>
                            <input type="text" name="company_name" class="input form-control" id="bill_company_name">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->
                    <li class="row">
                        <div class="col-sm-6">
                            <label for="last_name" class="required">Last Name</label>
                            <input type="text" name="lname"   data-validation-error-msg="Please Enter Last Name" data-validation="required" class="input form-control" id="bill_last_name">
                        </div><!--/ [col] -->
                        
                        <div class="col-xs-6">

                            <label for="address" class="required">Address</label>
                            <input type="text" class="input form-control" name="add1" id="address"    data-validation-error-msg="Please Enter Address" data-validation="required" >

                        </div>
                        
                    </li><!--/ .row -->
                    <li class="row"> 
                        
                        <div class="col-sm-6">
                            <label for="email_address" class="required">Email Address</label>
                            <input type="text"  data-validation="email" class="input form-control" name="email"    data-validation-error-msg="Please Enter Valid Email" data-validation="required"  id="email_address">
                        </div><!--/ [col] -->
                        
                        <div class="col-xs-6">

                            <label for="address" class="required">Address 2</label>
                            <input type="text" class="input form-control" name="add2" id="address2">

                        </div>
                        
                        
                        <!--/ [col] -->

                    </li><!-- / .row -->

                    <li class="row">
                         <div class="col-sm-6">
                            <label for="telephone" class="required">Telephone</label>
                            <input class="input form-control" type="text" name="tel" id="telephone">
                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            
                            <label for="city" class="required">City</label>
                            <input class="input form-control" type="text" name="city" id="city"    data-validation-error-msg="Please City Name" data-validation="required" >

                        </div><!--/ [col] -->

                        
                    </li><!--/ .row -->

                    <li class="row">
                        <div class="col-sm-6">
                            <label for="password" class="required">Password</label>
                            <input class="input form-control" type="password" name="pass_confirmation" id="password"    data-validation-error-msg="Please Enter Password" data-validation="strength" data-validation-strength="2" data-validation="required" >
                        </div><!--/ [col] -->
                        <div class="col-sm-6">

                            <label for="postal_code" class="required">Zip/Postal Code</label>
                            <input class="input form-control" type="text" name="zip" id="postal_code">
                        </div><!--/ [col] -->

   
                    </li><!--/ .row -->
 

                    <li class="row">
                   

                        <div class="col-sm-6">
                            <label for="confirm" class="required">Confirm Password</label>
                            <input class="input form-control" type="password"  name="pass" data-validation="confirmation" id="confirm"  data-validation-error-msg="Password Do Not Match" >
                        </div><!--/ [col] -->
                        
                                             <div class="col-sm-6">
                            <label class="required">State/Province</label>
                                <select class="input form-control" name="state">
                                    <option value="Alabama">Alabama</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Kansas">Kansas</option>
                            </select>
                        </div><!--/ [col] -->
                    </li><!--/ .row -->
                     <li class="row">
                         <div class="col-sm-6">
                        <button class="button" type="submit" id="register_account">Register</button>
                         </div>
                    </li>
                </ul>
                </form>
            </div>
                
            </div>
        </div>
    </div>
</div>
<!-- ./page wapper-->

<?php include_once("footer.php") ?>