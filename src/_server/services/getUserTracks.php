<?php

include("headers.php");

    if ( $user ) {
        //logged in so look for tracks for user email

        $trackArr = array();

        /*$trackQuery = 'SELECT t.* FROM users u'
        . ' JOIN userTracks ut'
        . ' ON u.userID = ut.userID'
        . ' JOIN tracks t'
        . ' ON t.trackID = ut.trackID'
        . ' WHERE u.userID = ' . $userID;*/

        $trackQuery = "SELECT t.* FROM tracks t INNER JOIN userTracks ut ON t.trackId = ut.trackId where ut.userID=$userID";

        $trackQueryResult = mysql_query( $trackQuery );
        $trackField = mysql_fetch_array( $trackQueryResult, MYSQL_ASSOC );

        if ( $trackField )  {

            //if matches found then add to tracks to an array and echo
            do {

                array_push($trackArr ,$trackField);

            } while ($trackField = mysql_fetch_array( $trackQueryResult, MYSQL_ASSOC ));

        }

        echo json_encode($trackArr);

    } else {

        echo json_encode('loggedout');

    }

?>