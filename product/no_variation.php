<?php if($product['variation_type']=='none') {   ?>

                                <div class="form-option">
<?php 
$sqlc = "select * from variations where parent_product_id={$product['id']} and variation_type='none'";
$result_setc = $dtb->query($sqlc);

while( $resultc = $result_setc->fetch_object()){

	$variation= array(
    'id'=>$resultc->id,
    'sale_price'=>$resultc->sale_price,
    'msp_price'=>$resultc->msp_price,
    'sale_start_date'=>$resultc->sale_start_date,
    'sale_end_date'=>$resultc->sale_end_date,
    'whole_sale_price'=>$resultc->whole_sale_price
    );

?>


                                       
                                
                                     <form action="add_to_cart.php" method="post">

                                                                     <div class="product-price-group" id="product_price">

                                    <?php if($variation['sale_price'] < $variation['msp_price']){

                                    ?>
                                    <span class="price">    $<?php echo number_format($variation['sale_price'],2) ?></span>
                                    <span class="old-price">$<?php echo number_format($variation['msp_price'],2) ?></span>
                                    <span class="discount">-<?php echo floor(($variation['msp_price']-$variation['sale_price'])*100/$variation['msp_price']) ?>%</span>
                                

                                    <?php  }   
                                    else{ 
                                        ?>
                                        <span class="price">$<?php echo $variation['msp_price']; ?></span>
                                    <?php  }   ?>

                                </div>

                                    <div class="attributes">

                                       
                                <input type="hidden" value="<?php echo $variation['id'] ?>" name="id" />
                                
                                
                               
                                        <div class="attribute-label">Qty:</div>
                                        <div class="attribute-list product-qty">
                                            <div class="qty">
                                                <input id="option-product-qty" type="text"  name="qty" value="1">
                                            </div>
                                            <div class="btn-plus">
                                                <a href="#" class="btn-plus-up">
                                                    <i class="fa fa-caret-up"></i>
                                                </a>
                                                <a href="#" class="btn-plus-down">
                                                    <i class="fa fa-caret-down"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                 
                                </div>







                                <div class="form-action">
                                    <div class="button-group">
                                        <input type="submit" class="btn-add-cart" value="Add to cart">
                                    </div>
                                    <div class="button-group">
                                        <a class="wishlist" href="#"><i class="fa fa-heart-o"></i>
                                        <br>Wishlist</a>
                                    </div>
                                </div>
                                 </form>
<?php } ?>
<?php } ?>