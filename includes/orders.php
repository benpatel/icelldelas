<?php
require_once("functions.php");
require_once("database.php");


class Orders{

		public function order_check($id,$seller_id){
		global $dtb;
		$sql =  "select * from sales_records where sales_id={$id} and seller_id='{$seller_id}' limit 1";
		$total_records =  $dtb->num_rows($dtb->query($sql));
			if($total_records >=1){
			$value = "yes";	
			}
			else{
			$value = "no";
			}
		return $value;	
		}

}

$order = new Orders;
?>