<?php

include("headers.php");

//$submit = $_POST["submit"];
$email = $_POST["email"];
$password = $_POST["pass"];
$password2 = $_POST["pass2"];
$md5 = md5($password);
$validemail = preg_match("/^[a-z0-9_-]+(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)*[a-z0-9_-]+\.[a-z]{2,}$/i", $email); //VALID EMAIL PATTERN

if(!$user){
    //CHECKS IF ALL FIELDS HAVE BEEN FILLED
    if($email&&$password&&$password2){
        //CHECKS IF EMAIL IS VALID
        if($validemail){
            $q = mysql_query("SELECT * FROM $table WHERE email='$email'");
            $n = mysql_num_rows($q);
            
            //CHECKS IF EMAIL ALREADY EXISTS IN THE DATABASE
            if(!$n){
                $q = mysql_query("SELECT * FROM $table WHERE email='$email'");
                $n = mysql_num_rows($q);
                
                //CHECKS IF USERNAME ALREADY EXISTS IN THE DATABASE
                if(!$n){

                    //CHECKS IF PASSWORD IS 6 CHARACTERS OR MORE
                    if(strlen($password)>=6){

                        //CHECKS IF THE PASSWORD AND CONFIRMATION PASSWORD MATCH
                        if($password2==$password){
                            //IF ALL CONDITIONS ARE TRUE, THE USER IS REGISTERED AND AN ACTIVATION KEY IS PROCESSED AND SENT VIA EMAIL
                            $alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                            $length = 11;
                                
                            for($i=0; $i<$length; $i++){
                                $ran = rand(0, strlen($alpha)-1);
                                $key .= substr($alpha, $ran, 1);
                            }
                            
                            //REGISTERS USER
                            mysql_real_escape_string(mysql_query("INSERT INTO $table VALUES('', '$email', '$password', '$md5', '$key', 'false')"));
                    
                            //SENDS EMAIL THAT TELLS THE USER TO ACTIVATE THE ACCOUNT

                            $activation = "?email=".$email."&key=".$key;
                            
                            $your_email = 'donotreply'; //CHANGE TO YOUR SETTINGS
                            $domain = $_SERVER["HTTP_HOST"]; //YOUR DOMAIN AND EXTENSION
                            $directory = dirname($_SERVER["PHP_SELF"]); //FOLDER WHERE THE FILES WILL BE LOCATED
                            
                            $to = $email;
                            $subject = "Nebtune Account Activation";
                            $message = "Welcome, ".$email.". You must activate your account via this message to log in. Click the following link to do so: http://".$domain."/".$activation;
                            $headers = "From: Nebtune <".$your_email."@".$domain.">\r\n"; //MODIFY TO YOUR SETTINGS
                            $headers .= "Content-type: text/html\r\n";
                            mail($to, $subject, $message, $headers);
                            
                            //Activation succsessful
                            echo json_encode('registered');

                        } else {
                            echo json_encode("Passwords don't match.");
                        }

                    } else {
                        echo json_encode("Password must be at least 6 characters long.");
                    }

                } else {
                    echo json_encode("This email is already registered");
                }
            } else {
                echo json_encode("This email is already registered.");
            }
        } else {
            echo json_encode("Please enter a valid email address.");
        }
    } else {
        echo json_encode("Please fill all fields.");
    }
} else {
    //IF USER IS ALREADY LOGGED IN
    echo json_encode('Already logged in as '.$user.', you must logout before you can register as a new user.');

}

?>