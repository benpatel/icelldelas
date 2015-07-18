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
					$cart_data[$cart_item_rank]=$resultc->id;
					$cart_data[$cart_item_rank]=$resultc->id;
				}


						
                    	$cart_item_rank++;
			}
			return $cart_data;
			}
			
		}
		


}

$prd = new Product;
?>