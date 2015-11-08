<?php include_once("header.php") ?>
<!-- page wapper-->
<div class="columns-container">
    <div class="container" id="columns">
        <!-- breadcrumb -->
        <div class="breadcrumb clearfix">
            <a class="home" href="#" title="Return to Home">Home</a>
            <span class="navigation-pipe">&nbsp;</span>
            <span class="navigation_page">Your shopping cart</span>
        </div>
        <!-- ./breadcrumb -->
        <!-- page heading-->
        <h2 class="page-heading no-line">
            <span class="page-heading-title2">Shopping Cart Summary</span>
        </h2>
        <!-- ../page heading-->
        <div class="page-content page-order">
            <ul class="step">
                <li class="current-step"><span>01. Summary</span></li>
                <li><span>02. Address</span></li>
                <li><span>03. Shipping</span></li>
                <li><span>04. Payment</span></li>
            </ul>
            <div class="heading-counter warning">Your shopping cart contains:
                <span><?php echo $cart_qty ?> Product</span>
            </div>
            <div class="order-detail-content">
                <table class="table table-bordered table-responsive cart_summary">
                    <thead>
                        <tr>
                            <th class="cart_product">Product</th>
                            <th>Description</th>
                          
                            <th>Unit price</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th  class="action"><i class="fa fa-trash-o"></i></th>
                        </tr>
                    </thead>
                  
                    <?php	
                    if(isset($_SESSION['cart'])){
                    foreach($_SESSION['cart'] as $id =>$qty){
                    	$cart_product = $prd->get_product_details($id);
					?>
                      <tbody>
                        <tr>
                            <td class="cart_product">
                                <a href="#"><img src="<?php echo SITE_BASE.'scripts/image.php?width=100&amp;height=122&amp;image='.SITE_BASE.'product_images/'.$cart_product['image']; ?>" alt="Product"></a>
                            </td>
                            <td class="cart_description">
                                <p class="product-name"><a href="#"><?php echo $cart_product['name'] ?></a></p>
                                <small class="cart_ref">SKU : <?php echo $cart_product['main_sku'].$cart_product['sku']; ?></small><br>
                                <?php
                                    if($cart_product['variation_type']=="color"){
                                ?>
                                <small><a href="#"><?php  echo $cart_product['variation_type']." : ".$cart_product['variation_color']; ?></a></small><br>   
                                <?php
                                    }
                                    elseif($cart_product['variation_type']=="size"){
                                    ?>
                                <small><a href="#">Size : S</a></small>
                                <?php
                                }
                                ?>
                            </td>
                   
                            <td class="price"><span><?php echo "$".number_format($cart_product['price'],2) ?></span></td>
                            <td class="qty">
                                <input class="form-control input-sm product_qty"  data-productid="<?php echo $cart_product['id'] ?>" type="text" value="<?php echo $qty; ?>">
                                <a href="#" class="qty_ctrl qty_up"><i class="fa fa-caret-up"></i></a>
                                <a href="#" class="qty_ctrl qty_down"><i class="fa fa-caret-down"></i></a>
                            </td>
                            <td class="price">
                                <span><?php echo "$".number_format($cart_product['price']*$qty,2) ?></span></span>
                            </td>
                            <td class="action">
                                <a href="#">Delete item</a>
                            </td>
                        </tr>
               
                    
                    </tbody>
                    <?php
                }
                    ?>
                    <tfoot>
                        <tr>
                            <td colspan="2" rowspan="2"></td>
                            <td colspan="2">Total products (tax incl.)</td>
                            <td colspan="2">122.38 €</td>
                        </tr>
                        <tr>
                            <td colspan="2"><strong>Total</strong></td>
                            <td colspan="2"><strong>122.38 €</strong></td>
                        </tr>
                    </tfoot>   
                     <?php 
                
                }
                    ?> 
                </table>
                <div class="cart_navigation">
                    <a class="prev-btn" href="#">Continue shopping</a>
                    <a class="next-btn" href="#">Proceed to checkout</a>
                    <a class="next-btn" href="#" style="margin-right:20px;">Update Cart</a>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ./page wapper-->
<?php include_once("footer.php") ?>