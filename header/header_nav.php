 <?php
 $list = '<li class="active"><a href="#">Home</a></li>';
	$y = array("Latest","Top Seller","Phones","Contact Us");
	for($x =0; $x<4; $x++){
		$list .=  '<li class=""><a href="#">'.$y[$x].'</a></li>';
	}
	
	
	?>

<?php
$myFile = "header_nav.html"; // or .php   
$fh = fopen($myFile, 'w'); // or die("error");  
$stringData = $list;   	
fwrite($fh, $stringData);
echo "yes";
?>