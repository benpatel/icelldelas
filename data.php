<?php include_once("includes/initialize.php"); ?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<style type="text/css">
	*{
		margin: 0px;
		padding: 0px;
	}
	body{
		padding: 20px;
	}
	.data_type{
		display: inline-block;
		float: left;


	}
.data{
	float: left;
	max-width: 400px;
	clear: right;
}
.data_header{
	background: #f60;
	padding: 10px;
	line-height: 15px;
}
.data_type_set{
	border:solid 1px red;
	padding: 10px;
}
	h2{
		clear: both;
	}
	</style>
</head>
<body>

<?php
$result_set =$dtb->query("SHOW tables FROM `".DB_NAME."`");

while( $result = $result_set->fetch_object()){

echo "<h2>Table : ".$result->Tables_in_showatch_icell."</h2>";
	$database_tables =  $result->Tables_in_showatch_icell;

	$table_set =$dtb->query("DESCRIBE `".$database_tables."`");

	echo '<div class="data_type">';
		
	while( $table = $table_set->fetch_object()){
		
			echo "<div class=\"data\"><p class=\"data_header\">".$table->Field."</p>";
			echo "<p class=\"data_type_set\">".$table->Type."</p></div>";
			}
		
	echo "</div>";
}
?>
</body>
</html>