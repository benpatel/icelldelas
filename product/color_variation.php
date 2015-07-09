
<?php if($product['variation_type']=='color') {   ?>
                                <div class="form-option">
                                    <p class="form-option-title">Available Options:</p>
                                    <div class="attributes">
                                        <div class="attribute-label">Color:</div>
                                        <div class="attribute-list">
                                            <ul class="list-color">

<?php 
$sqlc = "select * from variations where parent_product_id={$product['id']} and variation_type='color'";
$result_setc = $dtb->query($sqlc);
$swatch_count=0;
while( $resultc = $result_setc->fetch_object()){
$swatch_color = $resultc->hexa;
if($swatch_count==0){

    $variation= array(
    'id'=>$resultc->id,
    'sale_price'=>$resultc->sale_price,
    'msp_price'=>$resultc->msp_price,
    'sale_start_date'=>$resultc->sale_start_date,
    'sale_end_date'=>$resultc->sale_end_date,
    'whole_sale_price'=>$resultc->whole_sale_price
    );


    $swatch_class="active";
    $swatch_active_color="#fff";
}
else{
     $swatch_active_color = $swatch_color;
     $swatch_class ='';
    }
    ?>
   <li style="background:<?php echo $resultc->hexa?>;"><a href="#" data-product-id="<?php echo $resultc->id?>" class="swatch <?php echo $swatch_class; ?>" data-toggle="tooltip" title="<?php echo ucfirst($resultc->color) ?>"><span class="fa fa-check swatch_color_active"  style="color:<?php echo $swatch_active_color ?>;"></span></a></li>



<?php 
$swatch_count++;
} ?>

                                            </ul>
                                        </div>
                                    </div>
                                     <form action="add_to_cart.php" method="post">
                                    <div class="attributes">

                                       
                                <input type="hidden" id="cart_product_id" value="<?php echo $variation['id'] ?>" name="id" />
                                
                                
                               
                                        <div class="attribute-label">Qty:</div>
                                        <div class="attribute-list product-qty">
                                            <div class="qty">
                                                <input id="option-product-qty" type="text"  name="qty"value="1">
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

                                <div class="working"><img src="assets/images/loading.gif" /></div>
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