  <!-- MAIN HEADER -->
<?php 
        if(isset($_SESSION['qty']) && count($_SESSION['qty'])>0){
                $cart_qty =  $_SESSION['qty'];
        }
        else{
            $cart_qty =  0;
        }
        if(!isset($_SESSION['cart_total'])){
            $_SESSION['cart_total']=0;
        }
?>
    <div class="container main-header">
        <div class="row">
            <div class="col-xs-12 col-sm-3 logo">
                <a href="index.html"><img alt="Kute Shop" src="assets/images/logo.png" /></a>
            </div>
            <div class="col-xs-7 col-sm-7 header-search-box">
                <form class="form-inline">
                      <div class="form-group form-category">
                        <select class="select-category">
                            <option value="2">All Categories</option>
                            <option value="1">Men</option>
                            <option value="2">Women</option>
                        </select>
                      </div>
                      <div class="form-group input-serach">
                        <input type="text"  placeholder="Keyword here...">
                      </div>
                      <button type="submit" class="pull-right btn-search"></button>
                </form>
            </div>
            <div id="cart-block" class="col-xs-5 col-sm-2 shopping-cart-box">
                <a class="cart-link" href="order.html">
                    <span class="title">Shopping cart</span>
                    <span class="total">Total - $<?php echo $_SESSION['cart_total']; ?></span>
                    <span class="notify notify-left"><?php echo $cart_qty; ?></span>
                </a>
              <!--  <div class="cart-block">
                    <div class="cart-block-content">
                        <h5 class="cart-title"><?php echo $cart_qty; ?> Items in my cart</h5>
                        <div class="cart-block-list">
                            <ul>
                                <li class="product-info">
                                    <div class="p-left">
                                        <a href="#" class="remove_link"></a>
                                        <a href="#">
                                        <img class="img-responsive" src="assets/data/product-100x122.jpg" alt="p10">
                                        </a>
                                    </div>
                                    <div class="p-right">
                                        <p class="p-name">Donec Ac Tempus</p>
                                        <p class="p-rice">61,19 €</p>

                                        <div class="change_quantity">
                                            <a class="blockcart_quantity_down" href="#">-</a>
                                            <input class="cart_quantity_input_text" type="text" value="1">
                                            <a class="blockcart_quantity_up" href="#">+</a>
                                        </div>
                                    </div>
                                </li>
                                <li class="product-info">
                                    <div class="p-left">
                                        <a href="#" class="remove_link"></a>
                                        <a href="#">
                                        <img class="img-responsive" src="assets/data/product-s5-100x122.jpg" alt="p10">
                                        </a>
                                    </div>
                                    <div class="p-right">
                                        <p class="p-name">Donec Ac Tempus</p>
                                        <p class="p-rice">61,19 €</p>

                                        <div class="change_quantity">
                                            <a class="blockcart_quantity_down" href="#">-</a>
                                            <input class="cart_quantity_input_text" type="text" value="1">
                                            <a class="blockcart_quantity_up" href="#">+</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="toal-cart">
                            <span>Total</span>
                            <span class="toal-price pull-right">122.38 €</span>
                        </div>
                        <div class="cart-buttons">
                            <a href="order.html" class="btn-my-cart">View my cart</a>
                            <a href="order.html" class="btn-check-out">Checkout</a>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        
    </div>
    <!-- END MANIN HEADER -->