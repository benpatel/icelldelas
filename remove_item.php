<?php 
include_once("includes/initialize.php"); 
if(isset($_POST['id'])){
	$id=$_POST['id'];
$product['status']='ok';

unset($_SESSION['cart'][$id]);

}
else{
$product['status']='error';	
}

	$_SESSION['qty']=count($_SESSION['cart']);

	$_SESSION['cart_total']=0;
if($_SESSION['qty']<=0){
unset($_SESSION['cart']);	
}
else{
foreach($_SESSION['cart'] as $id =>$prd){

	$sql = "select * from variations where id={$id} limit 1";
	$result_set = $dtb->query($sql);
	while( $result = $result_set->fetch_object()){
		
		$_SESSION['cart_total'] += ($result->sale_price * $prd);
	}
}
}
echo json_encode($product);
 ?>