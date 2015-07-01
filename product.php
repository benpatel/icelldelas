<?php
if(!isset($_REQUEST['id']) || !is_int(intval($_REQUEST['id']))){
header("Location: http://localhost:78/icelldeals/trunk/");
		die();
}
$id=intval($_REQUEST['id'])
?>
<?php include_once("header.php") ?>
<div class="">
<?php

$sql = "select * from products where id={$id} limit 1";
$result_set = $dtb->query($sql);
while( $result = $result_set->fetch_object()){
	
	$product= array(
	'id'=>$result->id,
	'name'=>$result->name,
	'sku'=>$result->sku,
	'brand'=>$result->brand,
	'description'=>$result->description,
    'variation_type'=>$result->variation_type
	);
}

?>
</div>
<div class="columns-container">
    <div class="container" id="columns">
        <!-- breadcrumb 
        <div class="breadcrumb clearfix">
            <a class="home" href="#" title="Return to Home">Home</a>
            <span class="navigation-pipe">&nbsp;</span>
            <a href="#" title="Return to Home">Fashion</a>
            <span class="navigation-pipe">&nbsp;</span>
            <a href="#" title="Return to Home">Women</a>
            <span class="navigation-pipe">&nbsp;</span>
            <a href="#" title="Return to Home">Dresses</a>
            <span class="navigation-pipe">&nbsp;</span>
            <span class="navigation_page">Maecenas consequat mauris</span>
        </div>
         ./breadcrumb -->
        <!-- row -->
        <div class="row">
            <!-- Left colunm -->
            <?php include_once("product/product_sidebar.html"); ?>
            <!-- ./left colunm -->
            <!-- Center colunm-->
            <div class="center_column col-xs-12 col-sm-9" id="center_column">
                <!-- Product -->
                    <div id="product">
                        <div class="primary-box row">
                            <div class="pb-left-column col-xs-12 col-sm-6">
                                <!-- product-imge-->
                                <div class="product-image">
                                    <div class="product-full">
                                        <img id="product-zoom" src='assets/data/product-s3-420x512.jpg' data-zoom-image="assets/data/product-s3-850x1036.jpg"/>
                                    </div>
                                    <div class="product-img-thumb" id="gallery_01">
                                        <ul class="owl-carousel" data-items="3" data-nav="true" data-dots="false" data-margin="20" data-loop="true">
                                            <li>
                                                <a href="#" data-image="assets/data/product-s3-420x512.jpg" data-zoom-image="assets/data/product-s3-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-s3-100x122.jpg" /> 
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-image="assets/data/product-s2-420x512.jpg" data-zoom-image="assets/data/product-s2-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-s2-100x122.jpg" /> 
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-image="assets/data/product-420x512.jpg" data-zoom-image="assets/data/product-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-100x122.jpg" /> 
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-image="assets/data/product-s4-420x512.jpg" data-zoom-image="assets/data/product-s4-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-s4-100x122.jpg" /> 
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-image="assets/data/product-s5-420x512.jpg" data-zoom-image="assets/data/product-s5-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-s5-100x122.jpg" /> 
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" data-image="assets/data/product-s6-420x512.jpg" data-zoom-image="assets/data/product-s6-850x1036.jpg">
                                                    <img id="product-zoom"  src="assets/data/product-s6-100x122.jpg" /> 
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!-- product-imge-->
                            </div>
                            <div class="pb-right-column col-xs-12 col-sm-6">
                                <h1 class="product-name"><?php echo $product['name'] ?></h1>
                                <div class="product-comments">
                                    <div class="product-star">
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star-half-o"></i>
                                    </div>
                                    <div class="comments-advices">
                                        <a href="#">Based  on 3 ratings</a>
                                        <a href="#"><i class="fa fa-pencil"></i> write a review</a>
                                    </div>
                                </div>
                                
                                <div class="info-orther">
                                    <p>Item Code: # PRD<?php echo $product['id']; ?></p>
                                    <!-- <p>Availability: <span class="in-stock">In stock</span></p> -->
                                </div>
                                <div class="product-desc">
                                    Vestibulum eu odio. Suspendisse potenti. Morbi mollis tellus ac sapien. Praesent egestas tristique nibh. Nullam dictum felis eu pede mollis pretium.Fusce egestas elit eget lorem. 
                                </div>



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

                                       
                                <input type="hidden" value="<?php echo $product['id'] ?>" name="id" />
                                
                                
                               
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
                                        <a class="compare" href="#"><i class="fa fa-signal"></i>
                                        <br>        
                                        Compare</a>
                                    </div>
                                </div>
                                 </form>
<?php } ?>                                
                                <div class="form-share">
                                    <div class="sendtofriend-print">
                                        <a href="javascript:print();"><i class="fa fa-print"></i> Print</a>
                                        <a href="#"><i class="fa fa-envelope-o fa-fw"></i>Send to a friend</a>
                                    </div>
                                    <div class="network-share">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- tab product -->
                        <div class="product-tab">
                            <ul class="nav-tab">
                                <li class="active">
                                    <a aria-expanded="false" data-toggle="tab" href="#product-detail">Product Details</a>
                                </li>
                                <li>
                                    <a aria-expanded="true" data-toggle="tab" href="#information">information</a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#reviews">reviews</a>
                                </li>
                               
                            </ul>
                            <div class="tab-container">
                                <div id="product-detail" class="tab-panel active">
                                    <p>Morbi mollis tellus ac sapien. Nunc nec neque. Praesent nec nisl a purus blandit viverra. Nunc nec neque. Pellentesque auctor neque nec urna.</p>

                                    <p>Curabitur suscipit suscipit tellus. Cras id dui. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Maecenas vestibulum mollis diam.</p>

                                    <p>Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Sed lectus. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Nam at tortor in tellus interdum sagittis. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est.</p>
                                </div>
                                <div id="information" class="tab-panel">
                                    <table class="table table-bordered">
                                        <tr>
                                            <td width="200">Compositions</td>
                                            <td>Cotton</td>
                                        </tr>
                                        <tr>
                                            <td>Styles</td>
                                            <td>Girly</td>
                                        </tr>
                                        <tr>
                                            <td>Properties</td>
                                            <td>Colorful Dress</td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="reviews" class="tab-panel">
                                    <div class="product-comments-block-tab">
                                        <div class="comment row">
                                            <div class="col-sm-3 author">
                                                <div class="grade">
                                                    <span>Grade</span>
                                                    <span class="reviewRating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </span>
                                                </div>
                                                <div class="info-author">
                                                    <span><strong>Jame</strong></span>
                                                    <em>04/08/2015</em>
                                                </div>
                                            </div>
                                            <div class="col-sm-9 commnet-dettail">
                                                Phasellus accumsan cursus velit. Pellentesque egestas, neque sit amet convallis pulvinar
                                            </div>
                                        </div>
                                        <div class="comment row">
                                            <div class="col-sm-3 author">
                                                <div class="grade">
                                                    <span>Grade</span>
                                                    <span class="reviewRating">
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </span>
                                                </div>
                                                <div class="info-author">
                                                    <span><strong>Author</strong></span>
                                                    <em>04/08/2015</em>
                                                </div>
                                            </div>
                                            <div class="col-sm-9 commnet-dettail">
                                                Phasellus accumsan cursus velit. Pellentesque egestas, neque sit amet convallis pulvinar
                                            </div>
                                        </div>
                                        <p>
                                            <a class="btn-comment" href="#">Write your review !</a>
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- ./tab product -->
                        <!-- box product -->
                        <div class="page-product-box">
                            <h3 class="heading">Related Products</h3>
                            <ul class="product-list owl-carousel" data-dots="false" data-loop="true" data-nav = "true" data-margin = "30" data-autoplayTimeout="1000" data-autoplayHoverPause = "true" data-responsive='{"0":{"items":1},"600":{"items":3},"1000":{"items":3}}'>
                                <li>
                                    <div class="product-container">
                                        <div class="left-block">
                                            <a href="#">
                                                <img class="img-responsive" alt="product" src="assets/data/p40.jpg" />
                                            </a>
                                            <div class="quick-view">
                                                    <a title="Add to my wishlist" class="heart" href="#"></a>
                                                    <a title="Add to compare" class="compare" href="#"></a>
                                                    <a title="Quick view" class="search" href="#"></a>
                                            </div>
                                            <div class="add-to-cart">
                                                <a title="Add to Cart" href="#add">Add to Cart</a>
                                            </div>
                                        </div>
                                        <div class="right-block">
                                            <h5 class="product-name"><a href="#">Maecenas consequat mauris</a></h5>
                                            <div class="product-star">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star-half-o"></i>
                                            </div>
                                            <div class="content_price">
                                                <span class="price product-price">$38,95</span>
                                                <span class="price old-price">$52,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="product-container">
                                        <div class="left-block">
                                            <a href="#">
                                                <img class="img-responsive" alt="product" src="assets/data/p35.jpg" />
                                            </a>
                                            <div class="quick-view">
                                                    <a title="Add to my wishlist" class="heart" href="#"></a>
                                                    <a title="Add to compare" class="compare" href="#"></a>
                                                    <a title="Quick view" class="search" href="#"></a>
                                            </div>
                                            <div class="add-to-cart">
                                                <a title="Add to Cart" href="#add">Add to Cart</a>
                                            </div>
                                        </div>
                                        <div class="right-block">
                                            <h5 class="product-name"><a href="#">Maecenas consequat mauris</a></h5>
                                            <div class="product-star">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star-half-o"></i>
                                            </div>
                                            <div class="content_price">
                                                <span class="price product-price">$38,95</span>
                                                <span class="price old-price">$52,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="product-container">
                                        <div class="left-block">
                                            <a href="#">
                                                <img class="img-responsive" alt="product" src="assets/data/p37.jpg" />
                                            </a>
                                            <div class="quick-view">
                                                    <a title="Add to my wishlist" class="heart" href="#"></a>
                                                    <a title="Add to compare" class="compare" href="#"></a>
                                                    <a title="Quick view" class="search" href="#"></a>
                                            </div>
                                            <div class="add-to-cart">
                                                <a title="Add to Cart" href="#add">Add to Cart</a>
                                            </div>
                                        </div>
                                        <div class="right-block">
                                            <h5 class="product-name"><a href="#">Maecenas consequat mauris</a></h5>
                                            <div class="product-star">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star-half-o"></i>
                                            </div>
                                            <div class="content_price">
                                                <span class="price product-price">$38,95</span>
                                                <span class="price old-price">$52,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="product-container">
                                        <div class="left-block">
                                            <a href="#">
                                                <img class="img-responsive" alt="product" src="assets/data/p39.jpg" />
                                            </a>
                                            <div class="quick-view">
                                                    <a title="Add to my wishlist" class="heart" href="#"></a>
                                                    <a title="Add to compare" class="compare" href="#"></a>
                                                    <a title="Quick view" class="search" href="#"></a>
                                            </div>
                                            <div class="add-to-cart">
                                                <a title="Add to Cart" href="#add">Add to Cart</a>
                                            </div>
                                        </div>
                                        <div class="right-block">
                                            <h5 class="product-name"><a href="#">Maecenas consequat mauris</a></h5>
                                            <div class="product-star">
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star"></i>
                                                <i class="fa fa-star-half-o"></i>
                                            </div>
                                            <div class="content_price">
                                                <span class="price product-price">$38,95</span>
                                                <span class="price old-price">$52,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- ./box product -->

                    </div>
                <!-- Product -->
            </div>
            <!-- ./ Center colunm -->
        </div>
        <!-- ./row-->
    </div>
</div>

<?php include_once("footer.php") ?>
