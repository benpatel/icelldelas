$.validate({
  form : '#register_form',
  modules : 'security',
  onModulesLoaded : function() {
    var optionalConfig = {
      fontSize: '12pt',
      padding: '4px',
      bad : 'Very Weak password',
      weak : 'Weak password',
      good : 'Good password',
      strong : 'Strong password'
    };

    $('input[name="pass_confirmation"]').displayPasswordStrength(optionalConfig);
  },
  onSuccess : function($form) {
      
    var form_data = $("#register_form").serialize();
      
        var account_request = $.ajax({
                          url: "process_account.php",
                          method: "POST",
                          data: form_data,
                          dataType: "json"
                        });
 
    account_request.done(function( data ) {
        //location.reload();
        console.log(data);
        if(data.code==1){
            console.log("Account Created");
        }
        else if(data.code=='x'){
            console.log("Some Error Occured")
        }
        else if(data.code==0){
            console.log("Account Already Exist with this email");
        }
        else{
        }
    })
    
    return false; // Will stop the submission of the form
      
    }


});

$("#checkout_billing_address").change(function(){
    
    if($(this).val()=="new_add"){
        $("#checkout_billing_address_form").css("display","block");
        $("#checkout_billing_address_form").data("addaddress","YES");
    }
    else{
        $("#checkout_billing_address_form").css("display","none");
        $("#checkout_billing_address_form").data("addaddress","NO");
    }
    
    console.log($("#checkout_billing_address_form").data("addaddress"));
    
});


$("#checkout_billing").click(function(){

    var addaddress_status  = $("#checkout_billing_address_form").data("addaddress");
    if(addaddress_status=="YES"){
var errors = [],

// Validation configuration
conf = {
  onElementValidate : function(valid, $el, $form, errorMess) {
     if( !valid ) {
      // gather up the failed validations
      errors.push({el: $el, error: errorMess});
         $el.css("border","solid 1px red");
          console.log($el);
     }
  }
},

// Optional language object
lang = {
 
};
    
  // reset error array
   errors = [];
   if( !$('#new_billing_add_form').isValid(lang, conf, false) ) {
       console.log(conf.onElementValidate);
   // console.log( errors );
   } else {
       
       var data = $("#new_billing_add_form").serialize();
           var request = $.ajax({
                          url: "add_billing_address.php",
                          method: "POST",
                          data: data,
                          dataType: "json"
                        });
 
    request.done(function( data ) {
         console.log(data);
         $('#new_billing_add_form')[0].reset();
        location.reload();
    })
   // The form is valid
   }
    
}else{
 console.log("Next Step");  
    console.log($("#checkout_billing_address").val());
    
    var cart_billing = $("#checkout_billing_address").val();
    var data = {
                'session_name':'cart_billing',
                'session_value':cart_billing,
                'table':'billing'
               };
    var request = $.ajax({
                          url: "add_session_address.php",
                          method: "POST",
                          data: data,
                          dataType: "json"
                        });
 
    request.done(function( data ) {
      
        if(data.status==1){
            
            /*
              <p class="fname_lname"><strong>BInal Patel</strong></p>
                    <p class="company">Icelldeals</p>
                    <p class="add">888 Hempstead tpke, Apt 2</p>
                    <p class="city">Franklin Square</p>
                    <p class="state_zip">NY - 11010</p>
            */
            
            $("#checkout_billing_data_box .fname_lname").text(data.address.fname+' '+data.address.lname);
            $("#checkout_billing_data_box .company").text(data.address.company);
            $("#checkout_billing_data_box .add").text(data.address.add1+', '+data.address.add2);
            $("#checkout_billing_data_box .city").text(data.address.city);
            $("#checkout_billing_data_box .state_zip").text(data.address.state+', '+data.address.zip);
            
            $("#checkout_billing_from_box").css("display","none");
            $("#checkout_billing_data_box").css("display","block");
        }
        
        
        
    })
    
}
    


});



/// Shipping Address



$("#checkout_shipping_address").change(function(){
    
    if($(this).val()=="new_add"){
        $("#checkout_shipping_address_form").css("display","block");
        $("#checkout_shipping_address_form").data("addaddress","YES");
    }
    else{
        $("#checkout_shipping_address_form").css("display","none");
        $("#checkout_shipping_address_form").data("addaddress","NO");
    }
    
    console.log($("#checkout_shipping_address_form").data("addaddress"));
    
});


$("#checkout_shipping").click(function(){

    var addaddress_status  = $("#checkout_shipping_address_form").data("addaddress");
    if(addaddress_status=="YES"){
var errors = [],

// Validation configuration
conf = {
  onElementValidate : function(valid, $el, $form, errorMess) {
     if( !valid ) {
      // gather up the failed validations
      errors.push({el: $el, error: errorMess});
         $el.css("border","solid 1px red");
          console.log($el);
     }
  }
},

// Optional language object
lang = {
 
};
    
  // reset error array
   errors = [];
   if( !$('#new_shipping_add_form').isValid(lang, conf, false) ) {
       console.log(conf.onElementValidate);
   // console.log( errors );
   } else {
       
       var data = $("#new_shipping_add_form").serialize();
           var request = $.ajax({
                          url: "add_billing_address.php",
                          method: "POST",
                          data: data,
                          dataType: "json"
                        });
 
    request.done(function( data ) {
         console.log(data);
         $('#new_shipping_add_form')[0].reset();
        location.reload();
    })
   // The form is valid
   }
    
}else{
 console.log("Next Step");  
    console.log($("#checkout_shipping_address").val());
    
    var cart_shipping = $("#checkout_shipping_address").val();
    var data = {
                'session_name':'cart_shipping',
                'session_value':cart_shipping,
                'table':'billing'
               };
    var request = $.ajax({
                          url: "add_session_address.php",
                          method: "POST",
                          data: data,
                          dataType: "json"
                        });
 
    request.done(function( data ) {
      
        if(data.status==1){
            
            /*
              <p class="fname_lname"><strong>BInal Patel</strong></p>
                    <p class="company">Icelldeals</p>
                    <p class="add">888 Hempstead tpke, Apt 2</p>
                    <p class="city">Franklin Square</p>
                    <p class="state_zip">NY - 11010</p>
            */
            
            $("#checkout_shipping_data_box .fname_lname").text(data.address.fname+' '+data.address.lname);
            $("#checkout_shipping_data_box .company").text(data.address.company);
            $("#checkout_shipping_data_box .add").text(data.address.add1+', '+data.address.add2);
            $("#checkout_shipping_data_box .city").text(data.address.city);
            $("#checkout_shipping_data_box .state_zip").text(data.address.state+', '+data.address.zip);
            
            $("#checkout_shipping_from_box").css("display","none");
            $("#checkout_shipping_data_box").css("display","block");
        }
        
        
        
    })
    
}
    


});