<?php
include_once("../includes/initialize.php");
$sql = "select * from category where show_on_main='yes'";
$result_set = $dtb->query($sql);

$list = '<li class="active"><a href="#">Home</a></li>';
while( $result = $result_set->fetch_object()){
			$list .=  '<li class="dropdown">
           <a href="category.html" class="dropdown-toggle" data-toggle="dropdown">'.$result->category_name.'</a>';
		   
		   	$sql1 = "select * from products where promotion_category={$result->id} order by id limit 4";
    	   	$result_set1 = $dtb->query($sql1);
		   if($result_set1->num_rows >0){
		   $list .='<ul class="dropdown-menu mega_dropdown" role="menu" style="width: 830px; left: 0px;">';
		   while( $result1 = $result_set1->fetch_object()){
			$list .='<li class="block-container col-sm-3">
						<ul class="block">
							<li class="img_container">
								<a href="#">
									<img class="img-responsive" src="'.SITE_BASE.'/scripts/image.php?width=200&amp;height=200&amp;image='.SITE_BASE.'assets/data/01_blue-dress.jpg" alt="sport">
								</a>
								<a href="#" class="nav_product_image">'.$result1->name.'</a>
								<p>
								<span class="sale_price">$'.$result1->sale_price.'</span>
								<span class="msp_price">$'.$result1->msp_price.'</span>
								</p>
								<a href="#" class="btn-add-cart">Add to cart</a>
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