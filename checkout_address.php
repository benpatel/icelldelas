<?php include_once("header.php") ?>
<!-- page wapper-->
<div class="columns-container">
    <div class="container" id="columns">
        <!-- breadcrumb -->
        <div class="breadcrumb clearfix">
            <a class="home" href="#" title="Return to Home">Home</a>
            <span class="navigation-pipe">&nbsp;</span>
            <span class="navigation_page">Checkout</span>
        </div>
        <!-- ./breadcrumb -->
        <!-- page heading-->
        <h2 class="page-heading">
            <span class="page-heading-title2">Checkout</span>
        </h2>
        <!-- ../page heading-->
        <div class="row">
            <div class="col-sm-8">
            <div class="page-content checkout-page">

            <h3 class="checkout-sep">1. Billing Infomations</h3>
            <div class="box-border checkout_steps" id="checkout_step_2">
                
                
                <div id="checkout_billing_from_box">
                <p>Select Billing Address or Enter New One</p>
                <select id="checkout_billing_address"  class="input form-control" >
                    <?php
    $billing_address_sql = "select * from billing where buyer_id={$_SESSION['user']['id']} order by id asc";
                $result_set = $dtb->query($billing_address_sql);
                while( $result = $result_set->fetch_object()){

                    echo '<option value="'.$result->id.'" selected>&nbsp;'.$result->add1.','.$result->city.','.$result->state.' '.$result->zip.'</option>';

                }

                    if($result_set->num_rows <=0){
                        
                        $billing_dispaly='display:block';
                        $addaddress ="YES";
                    }
                    else{
                        $billing_dispaly='';
                        $addaddress ="NO";
                    }
                ?>
                    <option value="new_add">Enter New Address</option>
                </select>
                <div id="checkout_billing_address_form" data-addaddress="<?php echo $addaddress; ?>" style="<?php echo $billing_dispaly ?>">
                    <form method="post" id="new_billing_add_form">
                    <ul>
                 <li class="row">
                        <div class="col-sm-12">
                            <label for="first_name" class="required">First Name</label>
                            <input type="text" class="input form-control" name="fname"  data-validation="required"  data-validation-error-msg="Please Enter First Name"  id="bill_first_name">
                        </div><!--/ [col] -->
                    </li>
                 <li class="row">
                        <div class="col-sm-12">
                            <label for="first_name" class="required">Last Name</label>
                            <input type="text" class="input form-control" name="lname" id="bill_first_name"   data-validation="required"  data-validation-error-msg="Please Enter Last Name"  >
                        </div><!--/ [col] -->
                    </li>                    
                 <li class="row">

                        <div class="col-sm-12">
                            <label for="company_name">Company Name</label>
                            <input type="text" name="company_name" class="input form-control" id="bill_company_name">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->
                    <li class="row">
            
                        
                        <div class="col-xs-12">

                            <label for="address" class="required">Address</label>
                            <input type="text" class="input form-control" name="add1" id="address"   data-validation="required"  data-validation-error-msg="Please Enter Address"  >

                        </div>
                        
                    </li><!--/ .row -->
                    <li class="row"> 
                        
                     
                        <div class="col-xs-12">

                            <label for="address" class="required">Address 2</label>
                            <input type="text" class="input form-control" name="add2" id="address2">

                        </div>
                        
                        
                        <!--/ [col] -->

                    </li><!-- / .row -->

                    <li class="row">
                         

                        <div class="col-sm-12">
                            
                            <label for="city" class="required">City</label>
                            <input class="input form-control" type="text" name="city" id="city"   data-validation="required"  data-validation-error-msg="Please Enter State Name"  >

                        </div><!--/ [col] -->

                        
                    </li><!--/ .row -->

                    <li class="row">
                     
                        <div class="col-sm-12">

                            <label for="postal_code" class="required">Zip/Postal Code</label>
                            <input class="input form-control" type="text" name="zip" id="postal_code"   data-validation="required"  data-validation-error-msg="Please Enter Zip"  >
                        </div><!--/ [col] -->

   
                    </li><!--/ .row -->


                    <li class="row">
                   

               
                        
                                             <div class="col-sm-12">
                            <label class="required">State/Province</label>
                                <select class="input form-control" name="state">
                                    <option value="NY">New York</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Kansas">Kansas</option>
                            </select>
                        </div><!--/ [col] -->
                    </li><!--/ .row -->

                </ul>
                        <input type="hidden" name="buyer_id" value="<?php echo $_SESSION['user']['id'] ?>" />                  
                    </form>
                </div>
                <button class="button" id="checkout_billing">Continue</button>
                </div>
                
                <div id="checkout_billing_data_box">
                    <h3>Billig Address <a href="" style="color:red; font-size:12px;vertical-align: middle;">(Change)</a></h3>
                    <p class="fname_lname"><strong>BInal Patel</strong></p>
                    <p class="company">Icelldeals</p>
                    <p class="add">888 Hempstead tpke, Apt 2</p>
                    <p class="city">Franklin Square</p>
                    <p class="state_zip">NY - 11010</p>
                </div>
      
            </div>
            <h3 class="checkout-sep">3. Shipping Information</h3>
            <div class="box-border checkout_steps" id="checkout_step_3">
                
                 <div id="checkout_shipping_from_box">
                <p>Select Billing Address or Enter New One</p>
                <select id="checkout_shipping_address"  class="input form-control" >
                    <?php
    $billing_address_sql = "select * from billing where buyer_id={$_SESSION['user']['id']} order by id asc";
                $result_set = $dtb->query($billing_address_sql);
                while( $result = $result_set->fetch_object()){

                    echo '<option value="'.$result->id.'" selected>&nbsp;'.$result->add1.','.$result->city.','.$result->state.' '.$result->zip.'</option>';

                }

                    if($result_set->num_rows <=0){
                        
                        $billing_dispaly='display:block';
                        $addaddress ="YES";
                    }
                    else{
                        $billing_dispaly='';
                        $addaddress ="NO";
                    }
                ?>
                    <option value="new_add">Enter New Address</option>
                </select>
                <div id="checkout_shipping_address_form" data-addaddress="<?php echo $addaddress; ?>" style="<?php echo $billing_dispaly ?>">
                    <form method="post" id="new_shipping_add_form">
                    <ul>
                 <li class="row">
                        <div class="col-sm-12">
                            <label for="first_name" class="required">First Name</label>
                            <input type="text" class="input form-control" name="fname"  data-validation="required"  data-validation-error-msg="Please Enter First Name"  id="bill_first_name">
                        </div><!--/ [col] -->
                    </li>
                 <li class="row">
                        <div class="col-sm-12">
                            <label for="first_name" class="required">Last Name</label>
                            <input type="text" class="input form-control" name="lname" id="bill_first_name"   data-validation="required"  data-validation-error-msg="Please Enter Last Name"  >
                        </div><!--/ [col] -->
                    </li>                    
                 <li class="row">

                        <div class="col-sm-12">
                            <label for="company_name">Company Name</label>
                            <input type="text" name="company_name" class="input form-control" id="bill_company_name">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->
                    <li class="row">
            
                        
                        <div class="col-xs-12">

                            <label for="address" class="required">Address</label>
                            <input type="text" class="input form-control" name="add1" id="address"   data-validation="required"  data-validation-error-msg="Please Enter Address"  >

                        </div>
                        
                    </li><!--/ .row -->
                    <li class="row"> 
                        
                     
                        <div class="col-xs-12">

                            <label for="address" class="required">Address 2</label>
                            <input type="text" class="input form-control" name="add2" id="address2">

                        </div>
                        
                        
                        <!--/ [col] -->

                    </li><!-- / .row -->

                    <li class="row">
                         

                        <div class="col-sm-12">
                            
                            <label for="city" class="required">City</label>
                            <input class="input form-control" type="text" name="city" id="city"   data-validation="required"  data-validation-error-msg="Please Enter State Name"  >

                        </div><!--/ [col] -->

                        
                    </li><!--/ .row -->

                    <li class="row">
                     
                        <div class="col-sm-12">

                            <label for="postal_code" class="required">Zip/Postal Code</label>
                            <input class="input form-control" type="text" name="zip" id="postal_code"   data-validation="required"  data-validation-error-msg="Please Enter Zip"  >
                        </div><!--/ [col] -->

   
                    </li><!--/ .row -->


                    <li class="row">
                   

               
                        
                                             <div class="col-sm-12">
                            <label class="required">State/Province</label>
                                <select class="input form-control" name="state">
                                    <option value="NY">New York</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Kansas">Kansas</option>
                            </select>
                        </div><!--/ [col] -->
                    </li><!--/ .row -->

                </ul>
                        <input type="hidden" name="buyer_id" value="<?php echo $_SESSION['user']['id'] ?>" />                  
                    </form>
                </div>
                <button class="button" id="checkout_shipping">Continue</button>
                </div>
                
                <div id="checkout_shipping_data_box">
                    <h3>Billig Address <a href="" style="color:red; font-size:12px;vertical-align: middle;">(Change)</a></h3>
                    <p class="fname_lname"><strong>BInal Patel</strong></p>
                    <p class="company">Icelldeals</p>
                    <p class="add">888 Hempstead tpke, Apt 2</p>
                    <p class="city">Franklin Square</p>
                    <p class="state_zip">NY - 11010</p>
                </div>
                
                
            </div>
            <h3 class="checkout-sep">4. Shipping Method</h3>
            <div class="box-border checkout_steps"  id="checkout_step_4">
                <ul class="shipping_method">
                    <li>
                        <p class="subcaption bold">Free Shipping</p>
                        <label for="radio_button_3"><input type="radio" checked name="radio_3" id="radio_button_3">Free $0</label>
                    </li>

                    <li>
                        <p class="subcaption bold">Free Shipping</p>
                        <label for="radio_button_4"><input type="radio" name="radio_3" id="radio_button_4"> Standard Shipping $5.00</label>
                    </li>
                </ul>
                <button class="button" id="checkout_shipping_method">Continue</button>
            </div>
            <h3 class="checkout-sep">5. Payment Information</h3>
            <div class="box-border  checkout_steps"  id="checkout_step_5">

				<div class="col-sm-6">
                <button class="button pull-left">Procceed To Checkout</button>
                </div>

       			<div class="col-sm-6">
				<button class="button pull-right">Continue Shopping</button>
				</div>
            </div>

        </div>
            </div>
            <div class="col-sm-4">
            
            </div>
        </div>
    </div>
</div>
<!-- ./page wapper-->
<?php include_once("footer.php") ?>