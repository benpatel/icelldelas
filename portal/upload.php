<?php

$target_dir = "../product_images/";
$uploaded_files =[];
for($x=0; $x<count($_FILES["fileToUpload"]["name"]); $x++){
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"][$x]);
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

$target_file = date("Ymds").$x.".".$imageFileType;
$target_path = $target_dir.date("Ymds").$x.".".$imageFileType;
$uploadOk = 1;


// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"][$x]);
    //echo image_type_to_extension($check["mime"])."<-->";
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}
// Check if file already exists
if (file_exists($target_path)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}


// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$x], $target_path)) {
       // echo "The file ". basename( $_FILES["fileToUpload"]["name"][$x]). " has been uploaded.";
    	$uploaded_files[$x]=$target_file;
    } else {
       
    }
}

}

echo json_encode($uploaded_files);
?> 