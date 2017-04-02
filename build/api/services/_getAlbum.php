<?php

include("headers.php");

    if ( $user ) {
        //logged in so look for tracks for user email

        $trackIDArr = array();
        $trackArr = array();
        //find userIDs in joining track table

        $userTrackQuery  = "SELECT * FROM `userTracks` WHERE `userID`='$userID'";
        $userTrackQueryResult = mysql_query($userTrackQuery);
        $userTrackField = mysql_fetch_array($userTrackQueryResult);


        do {

            //track id
            $trackID = $userTrackField['trackID'];

            array_push($trackIDArr ,$trackID);


        } while ($userTrackField = mysql_fetch_array($userTrackQueryResult));

        //use track array to get tracks

        foreach( $trackIDArr as $track_id ){

            $trackQuery  = "SELECT * FROM `tracks` WHERE `trackID`='$track_id'";
            $trackQueryResult = mysql_query($trackQuery);
            $trackField = mysql_fetch_array($trackQueryResult);

            do {

                //push vales to object
                $trackObj = array(
                    "trackID" => $trackField['trackID'],
                    "number" => $trackField['number'],
                    "title" => $trackField['title'],
                    "album" => $trackField['album'],
                    "artist" => $trackField['artist'],
                    "duration" => $trackField['duration'],
                    "art" => $trackField['art'],
                    "type" => $trackField['type']         
                );

                array_push($trackArr ,$trackObj);

            } while ($trackField = mysql_fetch_array($trackQueryResult));

        }

        echo json_encode($trackIDArr);

    } else {

        json_encode('Please Login.');

    }

?>