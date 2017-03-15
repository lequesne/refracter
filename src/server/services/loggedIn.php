<?php

// TODO: UPDATE THIS FIRST - NEW LOGIN CHECK THAT WILL CHECK NEW PHP SET COOKIE/SESSION, GATHER USER PROFILE (PLAYLISTS,SETTINGS, USERDATA)
// WILL LIKELY REUSE THE SAME RETURN QUERY OF FOR USER PROFILE AS NORMAL USER AND PASSWORD LOGIN

// TODO://THEN WORK ON LOG OUT

// TODO://THEN WORK ON PASSWORD RESET

// TODO://THEN WORK ON USER ADDING TRACKS TO LIBRARY

// TODO://THEN WORK ON LOADING USER LIBRARY

// TODO://THEN WORK ON USER CREATED PLAYLISTS (CREATING, ADDING, LOADING)

// TODO://THEN WORK ON YOUTUBE SOURCE SELECTION FOR TRACKS WHEN LOGGED IN


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
