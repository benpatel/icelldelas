<?php
require_once("functions.php");
require_once("database.php");


class User{

		public function get_avatar($id){
		global $dtb;
		$sql =  "select * from user limit 1";
		$result_set = $dtb->query($sql);
			while($result = $dtb->fetch_array($result_set)){
			$img=  "tech/".$result['avatar'];
			}
		return $img;
		}

}

$user = new User;
?>