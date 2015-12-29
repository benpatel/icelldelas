var ICD = ICD || {};
ICD.CheckoutProcess = {};
console.log("golbal started")
ICD.CheckoutProcess  = Class.extend({
	init:function(){
		 this.bindEvents();
		 console.log("global initiated");
	},

	bindEvents:function(){
				// Step 1
		$("#checkout_step_1").css("display","block");

		$("#checkout_register").on("click",function(){

			$(".checkout_steps").slideUp(500);
			$("#checkout_step_2").slideDown(500);

		});

		// Step 2
		$("#checkout_billing").on("click",function(){

			$(".checkout_steps").slideUp(500);
			$("#checkout_step_3").slideDown(500);

		});

		// Step 3
		$("#checkout_shipping").on("click",function(){

			$(".checkout_steps").slideUp(500);
			$("#checkout_step_4").slideDown(500);

		});


		// Step 4
		$("#checkout_shipping_method").on("click",function(){

			$(".checkout_steps").slideUp(500);
			$("#checkout_step_5").slideDown(500);

		});

	}
});

new ICD();
var checkout = new ICD.CheckoutProcess();