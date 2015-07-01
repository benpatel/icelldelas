<?php include_once("includes/initialize.php"); 
if(isset($_POST['id']) && intval($_POST['id'])>0){
$id=intval($_POST['id']);
$sql = "select * from variations where id={$id} limit 1";
$result_set = $dtb->query($sql);
while( $result = $result_set->fetch_object()){
	
	$product= array(
	'id'=>$result->id,
	'sale_price'=>number_format($result->sale_price,2),
	'msp_price'=>number_format($result->msp_price,2),
	'sale_start_date'=>$result->sale_start_date,
	'sale_end_date'=>$result->sale_end_date,
    'whole_sale_price'=>number_format($result->whole_sale_price,2)
	);
}
}
else{
$product['status']='error';
}
echo json_encode($product);
?>