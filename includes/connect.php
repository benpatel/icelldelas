<?php 


require_once("constant.php");
$connect = mysql_connect(DB_SREVER,DB_USER,DB_PASS);

if (!$connect)
{
	
die("database Connection Failed:".mysql_error());	
}
?>


<?php 
$db_connect = mysql_select_db(DB_NAME,$connect);

if (!$db_connect)
{
	
die("database Connection Failed:".mysql_error());
}


?>