<?php

include("headers.php");

    $rid = $_POST['rid'];
    $ytid = $_POST['ytid'];

    if ( $rid && $ytid ) {

        if ( $user ) {
            //check usertracks table for existing entry

            $checkQuery = mysql_query("SELECT * FROM userTracks WHERE userID='$userID' AND trackID='$rid' ");
            $checkAssoc = mysql_fetch_assoc( $checkQuery );

            //if row found
            if ( $checkAssoc["userTrackID"] ) {
                //overwrite youtube source in row

               mysql_query("UPDATE userTracks SET source = '$ytid' WHERE userID='$userID' AND trackID='$rid' ");

               echo json_encode('updated');

            } else {
                //create new userTrack row with new youtube source

                mysql_query("INSERT INTO `userTracks` (`userTrackID`, `userID`, `trackID`, `source`) VALUES (NULL,'$userID','$rid','$ytid')");

                echo json_encode('added');

            }


        }

    }

?>


