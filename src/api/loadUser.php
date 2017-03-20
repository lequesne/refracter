<?php

require('includes/config.php');

//$storedCookieUsername = $_GET['username'];
$storedCookieValue = $_GET['cookie'];
$responseObject = Array();
$responseObject['success'] = false;

if( $user->is_logged_in() ) {
    //user php session active and logged in so return user data
	$responseObject['success'] = true;
	$responseObject['user'] = $user->getUserData();
} else {
    //no session active so check cookie for login
    if ( $storedCookieValue ) {
        //cookie values passed so compare with db
        if($user->login(null,null,$storedCookieValue)){
            //add user data to reponse object
			$responseObject['success'] = true;
			$responseObject['user'] = $user->getUserData();
        }
    }
}
echo json_encode($responseObject);
?>
