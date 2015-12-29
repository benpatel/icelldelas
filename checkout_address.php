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
        <div class="page-content checkout-page">
            <h3 class="checkout-sep">1. Checkout Method</h3>
            <div class="box-border checkout_steps"  id="checkout_step_1">
                <div class="row">
                    <div class="col-sm-6">
                        <h4>Register and save time!</h4>
                        <p>Register with us for future convenience:</p>
                        <p><i class="fa fa-check-circle text-primary"></i> Fast and easy check out</p>
                        <p><i class="fa fa-check-circle text-primary"></i> Easy access to your order history and status</p>
                        <button class="button" id="checkout_register">Register</button>
                    </div>
                    <div class="col-sm-6">
                        <h4>Login</h4>
                        <p>Already registered? Please log in below:</p>
                        <label>Email address</label>
                        <input type="text" class="form-control input">
                        <label>Password</label>
                        <input type="password" class="form-control input">
                        <p><a href="#">Forgot your password?</a></p>
                        <button class="button">Login</button>
                    </div>

                </div>
            </div>
            <h3 class="checkout-sep">2. Billing Infomations</h3>
            <div class="box-border checkout_steps" id="checkout_step_2">
                <ul>
                    <li class="row">
                        <div class="col-sm-6">
                            <label for="first_name" class="required">First Name</label>
                            <input type="text" class="input form-control" name="" id="first_name">
                        </div><!--/ [col] -->
                        <div class="col-sm-6">
                            <label for="last_name" class="required">Last Name</label>
                            <input type="text" name="" class="input form-control" id="last_name">
                        </div><!--/ [col] -->
                    </li><!--/ .row -->
                    <li class="row">
                        <div class="col-sm-6">
                            <label for="company_name">Company Name</label>
                            <input type="text" name="" class="input form-control" id="company_name">
                        </div><!--/ [col] -->
                        <div class="col-sm-6">
                            <label for="email_address" class="required">Email Address</label>
                            <input type="text" class="input form-control" name="" id="email_address">
                        </div><!--/ [col] -->
                    </li><!--/ .row -->
                    <li class="row"> 
                        <div class="col-xs-12">

                            <label for="address" class="required">Address</label>
                            <input type="text" class="input form-control" name="" id="address">

                        </div><!--/ [col] -->

                    </li><!-- / .row -->

                    <li class="row">

                        <div class="col-sm-6">
                            
                            <label for="city" class="required">City</label>
                            <input class="input form-control" type="text" name="" id="city">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            <label class="required">State/Province</label>
                                <select class="input form-control" name="">
                                    <option value="Alabama">Alabama</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Kansas">Kansas</option>
                            </select>
                        </div><!--/ [col] -->
                    </li><!--/ .row -->

                    <li class="row">

                        <div class="col-sm-6">

                            <label for="postal_code" class="required">Zip/Postal Code</label>
                            <input class="input form-control" type="text" name="" id="postal_code">
                        </div><!--/ [col] -->

                        <div  class="col-sm-6">
                            <label class="required">Country</label>
                            <select class="input form-control" name="">
                                <option value="USA">USA</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div><!--/ [col] -->
                    </li><!--/ .row -->
                    <li class="row">
                        <div class="col-sm-6">
                            <label for="telephone" class="required">Telephone</label>
                            <input class="input form-control" type="text" name="" id="telephone">
                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            <label for="fax">Fax</label>
                            <input class="input form-control" type="text" name="" id="fax">
                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">
                        <div class="col-sm-6">
                            <label for="password" class="required">Password</label>
                            <input class="input form-control" type="password" name="" id="password">
                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            <label for="confirm" class="required">Confirm Password</label>
                            <input class="input form-control" type="password" name="" id="confirm">
                        </div><!--/ [col] -->
                    </li><!--/ .row -->
                    <li>
                        <button class="button" id="checkout_billing">Continue</button>
                    </li>
                </ul>
            </div>
            <h3 class="checkout-sep">3. Shipping Information</h3>
            <div class="box-border checkout_steps" id="checkout_step_3">
                <ul>
                                    
                    <li class="row">
                        
                        <div class="col-sm-6">
                            
                            <label for="first_name_1" class="required">First Name</label>
                            <input class="input form-control" type="text" name="" id="first_name_1">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            
                            <label for="last_name_1" class="required">Last Name</label>
                            <input class="input form-control" type="text" name="" id="last_name_1">

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">
                        
                        <div class="col-sm-6">
                            
                            <label for="company_name_1">Company Name</label>
                            <input class="input form-control" type="text" name="" id="company_name_1">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">
                            
                            <label for="email_address_1" class="required">Email Address</label>
                            <input class="input form-control" type="text" name="" id="email_address_1">

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">

                        <div class="col-xs-12">

                            <label for="address_1" class="required">Address</label>
                            <input class="input form-control" type="text" name="" id="address_1">

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">

                        <div class="col-sm-6">
                            
                            <label for="city_1" class="required">City</label>
                            <input class="input form-control" type="text" name="" id="city_1">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">

                            <label class="required">State/Province</label>

                            <div class="custom_select">

                                <select class="input form-control" name="">

                                    <option value="Alabama">Alabama</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Kansas">Kansas</option>

                                </select>

                            </div>

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">

                        <div class="col-sm-6">

                            <label for="postal_code_1" class="required">Zip/Postal Code</label>
                            <input class="input form-control" type="text" name="" id="postal_code_1">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">

                            <label class="required">Country</label>

                            <div class="custom_select">

                                <select class="input form-control" name="">
                                    
                                    <option value="USA">USA</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Austria">Austria</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Canada">Canada</option>

                                </select>

                            </div>

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                    <li class="row">

                        <div class="col-sm-6">

                            <label for="telephone_1" class="required">Telephone</label>
                            <input class="input form-control" type="text" name="" id="telephone_1">

                        </div><!--/ [col] -->

                        <div class="col-sm-6">

                            <label for="fax_1">Fax</label>
                            <input class="input form-control" type="text" name="" id="fax_1">

                        </div><!--/ [col] -->

                    </li><!--/ .row -->

                </ul>
                <button class="button" id="checkout_shipping">Continue</button>
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
</div>
<!-- ./page wapper-->
<?php include_once("footer.php") ?>