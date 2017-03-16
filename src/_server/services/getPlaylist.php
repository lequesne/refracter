<?php

include("headers.php");

    $pid = $_GET['pid'];

    $playlistObject = array();
    $trackArr = array();

    $trackQuery = 'SELECT t.* FROM playlistTracks u'
    . ' JOIN tracks t'
    . ' ON t.trackID = u.trackID'
    . ' WHERE u.playlistID = ' . $pid;

    //track query
    $trackQueryResult = mysql_query( $trackQuery );
    $trackField = mysql_fetch_array( $trackQueryResult, MYSQL_ASSOC );

    //playlist info query
    $pQuery = mysql_query("SELECT * FROM `playlistTracks` WHERE `playlistID`='$pid' ");
    $playlistField = mysql_fetch_assoc($pQuery);

    if ( $trackField )  {
        //if matches found then add to tracks to an array

        do {

            array_push($trackArr ,$trackField);

        } while ($trackField = mysql_fetch_array( $trackQueryResult, MYSQL_ASSOC ));
        
    }

    $playlistObject = array(
        "name" => $playlistField['name'],
        "pid" => $playlistField['playlistID'],
        "tracks" => $trackArr,
        "subscribed" => $sub
    );

    echo json_encode( $playlistObject );

?>