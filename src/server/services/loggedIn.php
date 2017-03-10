<?php

include("headers.php");

$md5 = $_COOKIE['NTRM1'];
$email = $_COOKIE['NTRM2'];


if ( $user ) {
	//user is already logged in with a session

	$rememberArray = array(
		"phpsession" => true,
        "rememberme" => null,
        "e" => $email,
        "p" => null      
    );

} else if ( $md5 && $email ) {
	//found remember me cookies

	$q = mysql_query("SELECT * FROM $table WHERE md5='$md5' AND email='$email' ");
    $r = mysql_fetch_assoc($q);

    $rememberArray = array(
    	"phpsession" => null,
        "rememberme" => true,
        "e" => $email,
        "p" => $r["password"]       
    );

} else {
	//no cookies or session

	$rememberArray = array(
		"phpsession" => null,
        "rememberme" => null,
        "e" => null,
        "p" => null       
    );
    
}

echo json_encode( $rememberArray );

?>