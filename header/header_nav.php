<?php
include_once("../includes/initialize.php");
$sql = "select * from category where show_on_main='yes'";
$result_set = $dtb->query($sql);
?>
 <?php
$list = '<li class="active"><a href="#">Home</a></li>';
//$y = array("Latest","Top Seller","Phones","Tablest","Parts","Contact Us");
while($result = $dtb->fetch_array($result_set)){
			$list .=  '<li class=""><a href="#">'.$result['category_name'].'</a></li>';
}
?>

<?php
$myFile = "header_nav.html"; // or .php   
$fh = fopen($myFile, 'w'); // or die("error");  
$stringData = $list;   	
fwrite($fh, $stringData);
?>