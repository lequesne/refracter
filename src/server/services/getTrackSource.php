<?php

include("headers.php");

    $rid = $_GET['id'];

    if ( $user ) {

        //check to see if there is a user saved source first
        $sourceQuery = mysql_query("SELECT * FROM userTracks WHERE userID='$userID' AND trackID='$rid' ");
        $sourceField = mysql_fetch_assoc($sourceQuery);

        if ( $sourceField['source'] ) {
            //user has a saved source

            //echo back saved track source for user
            echo json_encode( $sourceField['source'] );

        } else {
            //no saved source so use existing sources from other users

            doSourceVote();

        }


    } else {
        //use existing sources from other users

        doSourceVote();

    }

    function doSourceVote() {
        //do count of most used sources for a track

        $rid = $_GET['rid'];
        $trackArr = array();
        $trackQuery = mysql_query("SELECT * FROM userTracks WHERE trackID='$rid' ");
        $trackField = mysql_fetch_assoc($trackQuery);

        if ( $trackField['source'] ) {

            do {

                if ( $trackField['source'] )
                    array_push( $trackArr , $trackField['source'] );

            } while ( $trackField = mysql_fetch_assoc($trackQuery) );

            //echo back highest rated source for track id
            $countedArray = array_count_values( $trackArr );
            echo json_encode( array_search(max($countedArray), $countedArray) );

        } else {
            //no sources for the track exist

            echo json_encode( false );

        }

    }

?>
