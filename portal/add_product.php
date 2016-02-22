<?php include_once("../includes/initialize.php"); ?>
<?php include_once("header.php"); ?>

<div class="container">
	<div class="row">
		<div style="height:20px;" ="spacer"></div>
	<div class="col-sm-6">
	<h2>Product Detail</h2>
			</br>
	<form action="add_prd.php" method="post" id="add_product">


	<ul>
                    <li class="row">
                        <div class="col-sm-12">
                            <label for="first_name" class="required">Product Name</label>
                            <input type="text" class="input form-control"  data-validation="required"  data-validation-error-msg="Please Enter Product Name" name="name" id="bill_first_name">
                        </div><!--/ [col] -->
                    </li>
                    <li class="row">    
                        <div class="col-sm-12">
                            <label for="sku">Product SKU</label>
                            <input type="text" name="sku" class="input form-control" id="bill_company_name"   data-validation="required"  data-validation-error-msg="Please Enter Product SKU">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->
                    <li class="row">    
                        <div class="col-sm-12">
                            <label for="UPC">UPC</label>
                            <input type="text" name="upc" class="input form-control" id="upc"   data-validation="length" data-validation-length="12-12" t data-validation="number"  data-validation="required"  data-validation-error-msg="Please Enter Valid UPC">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->

                    <li class="row">    
                        <div class="col-sm-12">
                            <label for="company_name">Brand</label>
                            <input type="text" name="brand" class="input form-control" id="brand">
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->

                     <li class="row">    
                        <div class="col-sm-12">
                            <label for="company_name">Compatible Model</label>
                            <select class="input form-control js-basic-single" name="model"   data-validation="required"  data-validation-error-msg="Please Choose Product Category" >
                                    <option value=""> - - Choose Compatible Model - - </option>
                                      <optgroup label="Phones">
                                         <option value="phone_case">iPhone 6</option>
                                         <option value="phone_case">iPhone 6 Plus</option>
                                         <option value="phone_case">iPhone 5/5S</option>
                                         <option value="phone_case">iPhone 5C</option>
                                         <option value="phone_case">Galaxy S6</option>
                                         <option value="phone_case">Galaxy S6 Edge Plus</option>
                                         <option value="phone_case">Galaxy Note 5</option>
                                         <option value="phone_case">Galaxy Note 4</option>
                                      </optgroup>
                                      <optgroup label="Tablets">
                                         <option value="phone_case">Ipad air 2</option>
                                         <option value="phone_case">Ipad air</option>
                                         <option value="phone_case">Galaxy Tab A</option>
                                         <option value="phone_case">Galaxy Tab E</option>

                                      </optgroup>
                                </select>
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->

                    <li class="row">    
                        <div class="col-sm-12">
                             <label class="required">Product Type</label>
                                <select class="input form-control js-basic-single" name="type"   data-validation="required"  data-validation-error-msg="Please Choose Product Category" >
                                   <option value=""> - - Choose Category - - </option>
                                    <option value="phone_case">Phone Case</option>
                                    <option value="charger">Chargers & cable</option>
                                    <option value="headphone">Headphone</option>
                                    <option value="battery">Battery</option>
                                    <option value="power_bank">Power Bank</option>
                                    <option value="bluetooth">Bluetooth</option>
                                    <option value="memory_card">Memory Card</option>
                                    <option value="tempered_glass">Tempered Glass</option>
                                    <option value="screen_protector">Screen Protector</option>
                                    <option value="tablet_case">Tablet Case</option>
                                    <option value="bluetooth">Bluetooth</option>
                                </select>
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->


                    <li class="row">    
                        <div class="col-sm-12">
                            <label class="required">Carrier</label>
                                <select class="input form-control js-basic-multiple" multiple="multiple" name="carrier[]">
                                    <option value="none" selected=""> -- None -- </option>
                                    <option value="all"> All Carriers</option>
                                    <option value="att"> AT&T</option>
                                    <option value="sprint"> Sprint</option>
                                    <option value="tmobile"> T-Mobile</option>
                                    <option value="metropcs"> MetroPCS</option>
                                    <option value="verizon"> Verizon</option>
                                    <option value="cricket"> Cricket</option>
                                    <option value="boostmobile"> Boost Mobile</option>
                                    
                            </select>
                        </div><!--/ [col] -->
                        
                    </li><!--/ .row -->

                    <li class="row">    
                        <div class="col-sm-3">
                            <label for="company_name">Regular Price</label>
                            <input type="text" name="reg_price" class="input form-control" data-validation="number" data-validation-allowing="float"  data-validation="required"  data-validation-error-msg="Please Enter Value">
                        </div><!--/ [col] -->
                        <div class="col-sm-3">
                            <label for="company_name">Sale Price</label>
                            <input type="text" name="sale_price" class="input form-control"   data-validation="number" data-validation-allowing="float" data-validation="required"  data-validation-error-msg="Please Enter Value">
                        </div><!--/ [col] -->
                        <div class="col-sm-3">
                            <label for="company_name">Wholesale Price</label>
                            <input type="text" name="whl_price" class="input form-control"   data-validation="number" data-validation-allowing="float"  data-validation="required"  data-validation-error-msg="Please Enter Value">
                        </div><!--/ [col] -->
                        <div class="col-sm-3">
                            <label for="company_name">Purchase Price</label>
                            <input type="text" name="buy_price" class="input form-control"  data-validation="number" data-validation-allowing="float"  data-validation="required"  data-validation-error-msg="Please Enter Value">
                        </div><!--/ [col] -->
                    </li><!--/ .row -->

                   <!-- <li class="row">    
                        <div class="col-sm-12">
                            <p>
                            <input type="checkbox" name="company_name" class="input" id="bill_company_name">
							<label for="company_name">Variation?</label>
                            </p>
                        </div>
                        
                    </li>--><!--/ .row -->


                    <li class="row variation_row">    
                        <div class="col-sm-12">
                        <p><strong>Variations</strong> <span class="Error_Display"></span></p>
                            <label class="required">Colors</label>
                            <p><input type="text" class="input" id="color_variation" list="colors_data"><a class="btn btn-default" id="color_variation_add">Add Color</a></p>

                            <datalist id="colors_data">
								  <option value="Black">
								  <option value="Red">
								  <option value="Pink">
								  <option value="Purple">
								  <option value="White">
								  <option value="Green">
								  <option value="Brown">
								  <option value="Orange">
								  <option value="Sky Blue">
								  <option value="Navy Blue">
								  <option value="Silver">
								  <option value="Gold">
								  <option value="Hot Pink">
								  <option value="Yellow">
								  <option value="Turquoise">
							</datalist>
                        </div><!--/ [col] -->

                    <div class="col-sm-12" id="variation_data_div">

                    </div>
                        
                    </li><!--/ .row -->

                    <li class="row">    
                        <div class="col-sm-12">   
                        <button type="submit" class="btn btn-default">Submit</button>
                        </div>
                    </li>
                           <li class="row">    
                           <div id="product_images">
                               
                           </div>
                           </li>

	</ul>                    
	</form>


	</div>

	<div class="col-sm-6">
			<h2>Upload Images <span class="image_Error_Display"></span></h2>
			</br>
			<form action="upload.php" method="post" id="file_upload" enctype="multipart/form-data">
			    <input type="file" name="fileToUpload[]" class="hidden" multiple id="fileToUpload">
			</form>
			<div id="uploaded_image_box">
				<div  class="uploaded_image" id="uploadTrigger"><p>+</p></div>
				<div style="clear:both"></div>
			</div>
			

	</div>

	</div>
</div>
<?php include_once("footer.php"); ?>