<?php

include("headers.php");

$sid = $_POST['sid'];
$name = $_POST['name'];
$rid = intval( $_POST['rid'] );
$status = $_POST['status'];
$time = intval( $_POST['time'] );

if ( $sid ) {

	$updateSession = mysql_query("UPDATE `recast` SET `name`='$name', `rid`='$rid', `status`='$status', `time`='$time' WHERE `sid`='$sid' ");

	if ( $updateSession ) {
		echo json_encode( $sid );
	}

}


?>