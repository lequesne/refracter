<?php

include("headers.php");

    if ( $user ) {
        //load all user info and settings including playlist names

        $playlistArr = array();
        $userSettings = array();

        //get all playlist names/ids associated with user
        $q = mysql_query("SELECT * FROM `playlistTracks` WHERE userID='$userID' AND trackID=0 ");
        
        $playlistField = mysql_fetch_array( $q, MYSQL_ASSOC );

        if ( $playlistField )  {
            //if matches found then add to tracks to an array and echo

            do {
                //push vales to object
                array_push($playlistArr ,$playlistField);

            } while ($playlistField = mysql_fetch_array( $q, MYSQL_ASSOC ) );
        
        }


        //load user settings here TO BE DONE


        //push vales to object
        $userProfile = array(
            "playlists" => $playlistArr,
            "settings" => $userSettings
        );

        echo json_encode( $userProfile );

    } else {

        json_encode('Please Login.');

    }

?>