<!-- Footer -->
	<footer id="footer">
	     <div class="container">
	     </div>
	</footer>

<script type="text/javascript" src="../assets/lib/jquery/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="../assets/lib/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../assets/lib/select2/js/select2.min.js"></script>
<script type="text/javascript" src="../assets/lib/jquery.bxslider/jquery.bxslider.min.js"></script>
<script type="text/javascript" src="../assets/lib/owl.carousel/owl.carousel.min.js"></script>
<script type="text/javascript" src="../assets/lib/jquery.countdown/jquery.countdown.min.js"></script>
<script type="text/javascript" src="../assets/lib/jquery.elevatezoom.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-form-validator/2.2.8/jquery.form-validator.min.js"></script>
<script type="text/javascript" src="../assets/lib/jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="../assets/lib/fancyBox/jquery.fancybox.js"></script>
<script type="text/javascript" src="../assets/js/jquery.actual.min.js"></script>
<script type="text/javascript" src="../assets/js/theme-script.js"></script>
<script type="text/javascript" src="admin.js"></script>
<script type="text/javascript">
	
$(".js-basic-multiple").select2();
$(".js-basic-single").select2();
$(".js-basic-multiple-tag").select2({
  tags: true,
  tokenSeparators: [',', ' ']
});

$("#color_variation_add").click(function(){

var color_data = $("#color_variation").val();
if(color_data !='' && $('.'+color_data).length < 1){
var data = $('<div class="variation_data '+color_data+'"><p><span>'+color_data+'</span><input type="text"  class="input sku" name="colors['+color_data+'][sku]" placeholder="SKU">'+
    		'<input type="text"  class="input qty" name="colors['+color_data+'][qty]" placeholder="quantity">'+
    		'<input type="color" class="input color" name="colors['+color_data+'][hexa]" value="#808040">'+
    		'<a href="" class="variation_data_delete"><i class="fa fa-trash"></i></a>'+
    		'<input type="hidden" name="colors['+color_data+'][color]" value="'+color_data+'"></p></div>');

$("#variation_data_div").append(data);
$("#color_variation").val("");	
}
});

$('body').on('click','a.variation_data_delete', function(event) {

	console.log($(this));

	$(this).parent('.variation_data').remove();
	event.preventDefault();
    // do something
});




</script>

</body>
</html>     