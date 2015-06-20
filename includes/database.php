<?php require_once("constant.php");
class Database{

	private $connect;

    
	function __construct(){
	$this->open_connection();
	$this->magic_quotes_active  = get_magic_quotes_gpc();
	$this->new_enough_php = function_exists("mysql_real_escape_string");
	session_start();
	}
	
	public function open_connection(){
			$this->connection = mysqli_connect(DB_SREVER,DB_USER,DB_PASS);
				if (!$this->connection)
				{
				die("database Connection Failed:".mysql_error());	
				}
				else
				{
				
					$db_connect = mysql_select_db(DB_NAME,$this->connection);

					if (!$db_connect)
						{	
						die("database Connection Failed:".mysql_error());
						}	
				}
		}
		
	public function close_connection(){
	global $connection;
		if(isset($this->$connection))
			{
			mysql_close($this->connection);
			}
		unset($this->connection);	
	}
	
	
	public function query($sql){
	
	$this->last_query =$sql;	
	$result = mysql_query($sql,$this->connection);
	$this->confirm_query($result);
	return $result;
		
	}
		
	private function confirm_query($result){
	
		if (!$result)
			{	
				echo $this->last_query." Had a problem<br>";
				die("table Connection Failed:".mysql_error());
			}	
	}

	public function fetch_array($result){
		
	return mysql_fetch_array($result);	
		
		
	}

	public function escape_value($value){
	

if($this->new_enough_php)
	{
	
		if($this->magic_quotes_active)
			{
			$value = stripslashes($value);
			}
	$value = mysql_real_escape_string($value);
	
	}
else
	{
		
	if(!$this->magic_quotes_active)
		{
		$value = addslashes($value);
		}
		
	}
return $value;

	}
	
	public function num_rows($result){
		
	return mysql_num_rows($result);	
		
		
	}
	
	public function affected_rows(){		
		
	return mysql_affected_rows($this->connection);	
	}

	
	

}


$dtb = new Database;




?>