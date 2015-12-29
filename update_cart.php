<?php 
include_once("includes/initialize.php"); 
$product = $_POST;
$_SESSION['qty']=0;
foreach ($product as $key => $value) {

	$_SESSION['cart'][$key]=$value;
	$_SESSION['qty']+=$value;
}


$_SESSION['cart_total']=0;
foreach($_SESSION['cart'] as $id =>$prd){

	$sql = "select * from variations where id={$id} limit 1";
	$result_set = $dtb->query($sql);
	while( $result = $result_set->fetch_object()){
		
		$_SESSION['cart_total'] += ($result->sale_price * $prd);
	}
}
$product['status']='ok';
echo json_encode($product);
 ?>