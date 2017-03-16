<?php

include("headers.php");

//IF USER IS LOGGED IN...
if($user){
    //LOGS USER OUT THE OLD-FASHIONED WAY AND GOES TO THE LOGIN PAGE
    session_unset();
    session_destroy();
} 

//IF USER JUST ACTIVATED THE ACCOUNT...
if($_POST["email"]&&$_POST["key"]){
    //EMAIL & ACTIVATION KEY
    $email = $_POST["email"];
    $key = $_POST["key"];
    
    //CHECKS IF BOTH THE EMAIL ADDRESS & THE ACTIVATION KEY ARE VALID
    $q = mysql_query("SELECT * FROM $table WHERE email='$email' AND code='$key'");
    $r = mysql_fetch_assoc($q);
    $n = mysql_num_rows($q);
    
    if($n){
        //ACTIVATES ACCOUNT IF IT HAS NOT BEEN ALREADY
        if($r["activated"]!="true"){
            mysql_query("UPDATE $table SET activated='true' WHERE email='$email' AND code='$key'");

            echo json_encode('activated');
        } else {
            //account already activated
            echo json_encode('alreadyActivated');
        }
    }
}

?>