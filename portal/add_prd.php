<?php include_once("../includes/initialize.php"); ?>
<?php
echo "<pre>";
print_r($_POST);
echo "</pre>";


$name = $_POST['name'];
$sku = $_POST['sku'];
$upc = $_POST['upc'];
$brand = $_POST['brand'];
$model = $_POST['model'];
$type = $_POST['type'];
$reg_price = $_POST['reg_price'];
$sale_price = $_POST['sale_price'];
$whl_price = $_POST['whl_price'];
$buy_price = $_POST['buy_price'];
$description = $_POST['description'];

$img = $_POST['images'][0];
$images = '';

foreach ($_POST['images'] as $image) {
	$images .=$image."|";	
}

if(count($_POST['colors'])>0){

	$variation_type='color';
}else{
	$variation_type='none';
}

echo $images;

$sql = "INSERT INTO `showatch_icell`.`products` 
(`id`, `name`, `sku`, `upc`, `brand`, `model`, `type`, `images`, `description`, `variation_type`, `promotion_category`, `img`) 
VALUES 
(NULL, '{$name}', '{$sku}', '{$upc}', '{$brand}', '{$model}', '{$type}', '{$images}', '{$description}', '{$variation_type}', '1', '{$img}')";

$result_set = $dtb->query($sql);

if($dtb->affected_rows()==1){
	$last_id =  $dtb->last_inserted_id();
	if(count($_POST['colors'])>0){

			foreach ($_POST['colors'] as $color) {
				
				print_r($color);

$sqlv = "INSERT INTO variations 
(sku,avg_purchase_price,sale_price,whole_sale_price,msp_price,quantity,order_thershold,color,hexa,variation_type,parent_product_id)
VALUES
('{$color['sku']}','{$buy_price}','{$sale_price}','{$whl_price}','{$reg_price}',{$color['qty']},10,'{$color['color']}','{$color['hexa']}','{$variation_type}',{$last_id})
";
$result_set = $dtb->query($sqlv);
			}
	}

}
else{

}

?>