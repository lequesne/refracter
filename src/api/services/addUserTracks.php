<?php

include("headers.php");

    $data = $_POST['data'];
    $pid = mysql_real_escape_string($_POST['pid']);
    $name = mysql_real_escape_string($_POST['name']);

    if ( $pid ) {
        //add to playlist

        //for each loop to insert into database
        foreach( $data as $d ){

            $trackID = mysql_real_escape_string($d['trackID']);

            mysql_query("INSERT INTO `playlistTracks` (`id`,`playlistID`,`userID`,`trackID`,`name`) VALUES (null ,'$pid','$userID','$trackID','$name')");

        }

        echo json_encode('tracks added to '.$name);


    } else {
        //add to library

        //for each loop to insert into database
        foreach( $data as $d ){

            $trackID = mysql_real_escape_string($d['trackID']);

            $q = mysql_query("SELECT * FROM `userTracks` WHERE `trackID`='$trackID' AND `userID`='$userID'");

            $rowNum = mysql_num_rows($q);

            //if matches found then add to tracks to an array
            if ( $rowNum === 0 ) {

                $SQL = "INSERT INTO `userTracks` (`userTrackID`, `userID`, `trackID`) VALUES (NULL,'$userID','$trackID')";

                //insert query
                mysql_query($SQL);

            }

        }

        echo json_encode('tracks added');

    }

?>