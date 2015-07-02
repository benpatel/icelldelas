<?php include_once("includes/initialize.php"); 

if(isset($_SESSION['cart'])){
	$product_id=$_POST['id'];
	$product_qty=$_POST['qty'];

	if(isset($_SESSION['cart'][$product_id])){
		$_SESSION['cart'][$product_id]+=$product_qty;
	}else{
	$_SESSION['cart'][$product_id]=$product_qty;
	}
	$_SESSION['qty']=count($_SESSION['cart']);
}
else{
	$_SESSION['cart']=array();
	$product_id=$_POST['id'];
	$product_qty=$_POST['qty'];

	if(isset($_SESSION['cart'][$product_id])){
		$_SESSION['cart'][$product_id]+=$product_qty;
	}else{
	$_SESSION['cart'][$product_id]=$product_qty;
	}


	$_SESSION['qty']=count($_SESSION['cart']);
}
$_SESSION['cart_total']=0;
foreach($_SESSION['cart'] as $id =>$prd){

	$sql = "select * from variations where id={$id} limit 1";
	$result_set = $dtb->query($sql);
	while( $result = $result_set->fetch_object()){
		
		$_SESSION['cart_total'] += ($result->sale_price * $prd);
	}
}
redirect_to($_SERVER['HTTP_REFERER'])
?>