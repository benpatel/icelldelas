<?php
include_once("../includes/initialize.php");
$_SESSION=array();
$sql = "select * from category where show_on_main='yes'";
$result_set = $dtb->query($sql);

$list = '<li class="active"><a href="#">Home</a></li>';
while( $result = $result_set->fetch_object()){
			$list .=  '<li class="dropdown drp">
           <a href="category.html" class="dropdown-toggle" data-toggle="dropdown">'.$result->category_name.'</a>';
		   
		   	$sql1 = "select * from products where promotion_category={$result->id} order by id limit 4";
    	   	$result_set1 = $dtb->query($sql1);
		   if($result_set1->num_rows >0){
		   $list .='<ul class="dropdown-menu mega_dropdown" role="menu" style="width: 830px; left: 0px;">';
		   while( $result1 = $result_set1->fetch_object()){
			$list .='<li class="block-container col-sm-3">
						<ul class="block">
							<li class="img_container">
								<a href="product/'.$result1->id.'/'.str_replace(" ","_",$result1->name).'">
									<img class="img-responsive" src="'.SITE_BASE.'scripts/image.php?width=200&amp;height=200&amp;image='.SITE_BASE.'assets/data/01_blue-dress.jpg" alt="sport">
								</a>
								<a href="product/'.$result1->id.'/'.str_replace(" ","_",$result1->name).'" class="nav_product_image">'.$result1->name.'</a>
								<p>
								<span class="sale_price">$'.$result1->sale_price.'</span>
								<span class="msp_price">$'.$result1->msp_price.'</span>
								</p>
								<form action="add_to_cart.php" method="post">
								<input type="hidden" value="'.$result1->id.'" name="id" />
								<input type="hidden" value="1" name="qty" />
								<input type="submit" class="btn-add-cart" value="Add to cart">
								</form>
							</li>
						</ul>
					</li>';			   
		   }
		   $list .='
			</ul>';
		   }
			
			
 $list .= '</li>';

}
echo "<pre>";
print_r($_SERVER);
echo "</pre>";
$myFile = "header_nav.html"; // or .php   
$fh = fopen($myFile, 'w'); // or die("error");  
$stringData = $list;   	
fwrite($fh, $stringData);
?>