<div class="top-header">
        <div class="container">
            <div class="nav-top-links">
                <a class="first-item" href="#"><img alt="phone" src="assets/images/phone.png" />00-62-658-658</a>
                <a href="#"><img alt="email" src="assets/images/email.png" />Contact us today!</a>
            </div>
           <!-- <div class="currency ">
                <div class="dropdown">
                      <a class="current-open" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">USD</a>
                      <ul class="dropdown-menu" role="menu">
                        <li><a href="#">Dollar</a></li>
                        <li><a href="#">Euro</a></li>
                      </ul>
                </div>
            </div>
            <div class="language ">
                <div class="dropdown">
                      <a class="current-open" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">
                      <img alt="email" src="assets/images/fr.jpg" />French
                      
                      </a>
                      <ul class="dropdown-menu" role="menu">
                        <li><a href="#"><img alt="email" src="assets/images/en.jpg" />English</a></li>
                        <li><a href="#"><img alt="email" src="assets/images/fr.jpg" />French</a></li>
                    </ul>
                </div>
            </div> -->
            
            <div class="support-link">
                <a href="#">Services</a>
                <a href="#">Support</a>
            </div>

            <div id="user-info-top" class="user-info pull-right">
                <div class="dropdown">
                    <a class="current-open" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#"><span>My Account 
                        
                         <?php 
                            if($_SESSION['loged_in']=="YES"){
                                
                                echo "(".$_SESSION['user']['fname']." ".$_SESSION['user']['lname'].")";
                            }
                                ?>
                        
                        
                        
                        </span></a>
                    <ul class="dropdown-menu mega_dropdown" role="menu">
                        
                        <?php 
                            if($_SESSION['loged_in']=="YES"){
                        ?>
                        
                        <li><a href="account.php">Account Overview</a></li>
                        
                        <?php
                            }
                            else{
                        ?>
                        
                        <li><a href="login.php">Login</a></li>
                        
                        <?php
                            }

                        ?>
                        
                        
                        <li><a href="#">Compare</a></li>
                        <li><a href="#">Wishlists</a></li>
                        <?php 
                            if($_SESSION['loged_in']=="YES"){
                        ?>
                        
                        <li><a href="log_out.php" style="color:red; font-weight:bold">Log Out</a></li>
                        
                        <?php
                            }
                            ?>

                    </ul>
                </div>
            </div>
        </div>
    </div>   
    <!--/.top-header -->