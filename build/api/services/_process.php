<?php

include("headers.php");

$postuser = $_POST["email"];
$pass = $_POST["pass"];
$rememberMe = $_POST["remember"];

if(!$user){
    if($postuser&&$pass){
        //CHECKS IF USERNAME AND PASSWORD MATCH IN THE DATABASE
        $q = mysql_query("SELECT * FROM $table WHERE email='$postuser'");
        $r = mysql_fetch_assoc($q);
        $n = mysql_num_rows($q);
        
        if($r["email"]){
            if($r["password"]==$pass){
                //CHECKS IF THE ACCOUNT IS ACTIVATED
                if($r["activated"]=='true'){

                    //set remember me cookie
                    if ( $rememberMe ) {
                        setcookie( 'NTRM1', $r["md5"], time() + 60*60*24*30, '/');
                        setcookie( 'NTRM2', $postuser, time() + 60*60*24*30, '/');
                    }

                    $_SESSION["user"] = $postuser;
                    $_SESSION["userID"] = $r["userID"];

                    session_write_close();

                    echo json_encode('loggedIn');

                } else {
                    echo json_encode('Account has not been activated, please recheck your email for an activation link');
                }
            } else {
                echo json_encode('Incorrect password');
            }
        } else {
            echo json_encode('Email doesn\'t exist');
        }
    } else {
        echo json_encode('Enter both fields');
    }
} else {
    echo json_encode('Already logged in as '.$user.'');
}

?>