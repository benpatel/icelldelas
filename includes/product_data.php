<?php
require_once("functions.php");
require_once("database.php");


class Product{
	
		public $color_array;	
	
		function __construct(){
			$this->cart = $this->get_cart_products();
		}

		public function get_cart_products(){
			// This function will look at 
			global $dtb;
			$cart_item_rank = 0;
			if(isset($_SESSION['cart'])){
			  foreach($_SESSION['cart'] as $id =>$qty){
			  	       	//$product_data = $dtb->get_product_data($id);
			  	$sqlc = "select * from variations where id={$id}";
				$result_setc = $dtb->query($sqlc);

				while( $resultc = $result_setc->fetch_object()){
					$cart_data[$cart_item_rank]['id']=$resultc->id;
					$cart_data[$cart_item_rank]['sku']=$resultc->sku;
					$cart_data[$cart_item_rank]['qty']=$qty;
				}


						
                    	$cart_item_rank++;
			}
			return $cart_data;
			}
			
		}
		
		public function get_product_details($id){
			global $dtb;

			$sqlc = "SELECT 
					variations.id, 
					variations.sku, 
					variations.images,
					variations.sale_price,
					variations.color,

					products.name,
					products.variation_type,
					products.sku as main_sku
					
					FROM variations
					INNER JOIN products
					
					ON variations.parent_product_id=products.id 

					where variations.id={$id}";

		
			$result_setc = $dtb->query($sqlc);

				while( $resultc = $result_setc->fetch_object()){
					$product_data['id']=$resultc->id;
					$product_data['price']=$resultc->sale_price;


					$swatch_images = explode("|", $resultc->images);
                     array_pop($swatch_images);

                     	

                     	if(!empty($swatch_images)){
          					$product_data['image'] = $swatch_images[0];           		
                     	}
                     	else{
							$product_data['image']="Dummy.jpg";
						}

					if($resultc->sku!=''){
						$product_data['sku']="_".$resultc->sku;
					}
					else{
						$product_data['sku']="";
					}
					
					$product_data['variation_type'] = $resultc->variation_type;
					$product_data['variation_color'] = $resultc->color;
					$product_data['main_sku'] = $resultc->main_sku;
					$product_data['name'] = $resultc->name;
					
				}

			return $product_data;

		}


}

$prd = new Product;
?>