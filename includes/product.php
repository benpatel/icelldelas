<?php
require_once("functions.php");
require_once("database.php");


class Product{
	
		public $color_array;	
	
		function __construct(){
			$this->create_color_array();
		}
		
		public function create_color_array(){
		global $dtb;
		$sql =  "select * from colors";
		$result_set = $dtb->query($sql);
			while($result = $dtb->fetch_array($result_set)){
				$this->color_array[$result['color']]=$result['sku'];

			}
		}
		
		public function get_last_product(){
		global $dtb;
		$sql =  "select id from main_product ORDER BY id DESC limit 1 ";
		$result_set = $dtb->query($sql);
			while($result = $dtb->fetch_array($result_set)){
			$id=  $result['id'];
			}
		return $id;
		}

}

$prd = new Product;
?>