<?php

include("headers.php");

$d=date ("d");
$m=date ("m");
$y=date ("Y");
$t=time();
$dmt=$d+$m+$y+$t;    
$ran= rand(0,10000000);
$dmtran= $dmt+$ran;
$un=  uniqid();
$dmtun = $dmt.$un;
$mdun = md5($dmtran.$un);
$newSid=substr($mdun, 16);

$session = mysql_query("INSERT INTO `recast` VALUES ('$newSid', NULL, NULL, NULL, NULL ) ");

if ( $session ) {
	echo json_encode( $newSid );
}


?>