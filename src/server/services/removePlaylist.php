<?php

include("headers.php");

    $pid = $_POST['pid'];

    if ( $pid ) {

    	mysql_query("UPDATE `playlistTracks` SET `userID`=-1 WHERE `playlistID`='$pid' ");

        echo json_encode('deleted');

    }

?>