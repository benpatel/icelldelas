$.validate({
  form : '#add_product',
  onSuccess : function($form) {
      
    var form_data = $("#add_product").serialize();

    error = true;
    error_text = "";
    if($('.variation_data').length >=1){
      

      $( ".variation_data" ).each(function() {
        if($( this ).find( ".sku" ).val()==''){

          error= false;
          error_text += "[ Correct SKU ]";
        }

        if($( this ).find( ".qty" ).val()==''){

          error= false;
          error_text += "[ Correct Quantity ]";
        }

        if($( this ).find( ".color" ).val()=='#808040'){

          error= false;
          error_text += "[ Choose Variation Color ]";
        }

       });

      if(!error){
        $(".Error_Display").text(error_text);
      }
 

    }
    $(".image_Error_Display").text('');
    if($("#product_images input").length <=0){
      $(".image_Error_Display").text("Please Upload Images");
      error= false;
    }
    return error; // Will stop the submission of the form
      
    }


});

$("#uploadTrigger").click(function(){
   $("#fileToUpload").click();
});


 $("#fileToUpload").change(function(){
 var fd = new FormData(document.querySelector("#file_upload"));
 var upload_request =  $.ajax({
    url: "upload.php",
    type: "POST",
    data: fd,
    processData: false,  // tell jQuery not to process the data
    contentType: false,  // tell jQuery not to set contentType
    dataType: "json"
  });


upload_request.done(function( data ) {
   for(var a=0; a<data.length; a++){
    var image_div = $('<div  class="uploaded_image"><img src="../product_images/'+data[a]+'" class="prd_images" /></div>');
    $("#uploaded_image_box").prepend(image_div);
    $("#product_images").append($('<input type="hidden" name="images[]" value="'+data[a]+'">'))
   }
   $(".image_Error_Display").text('');
 });


       return false;
    });

$('body').on('click','img.prd_images', function(event) {
  console.log($(this));

});