<?php

include("headers.php");

$sid = $_GET['sid'];

if ( $sid ) {

	$query = mysql_query("SELECT * FROM `recast` WHERE sid='$sid' ");
    $row = mysql_fetch_assoc($query);

    echo json_encode( $row );

}

?>