<?php

include("headers.php");

    $name = $_POST['name'];
    $pid = $_POST['pid'];

    if ( $name ) {

        //check if pid is provided which means its an edit of an existing playlist
        if ( $pid ) {
            //edit playlist name

            mysql_query("UPDATE `playlistTracks` SET `name`='$name' WHERE `playlistID`='$pid' ");

            $playlistInfo = array(
                "status" => 'edited'
            );

        } else {
            //new playlist name

            //first check if a playlist of matching name exists for the user
            $pQuery = mysql_query("SELECT * FROM `playlistTracks` WHERE `name`='$name' AND `userID`='$userID'");
            $playlistField = mysql_fetch_assoc($pQuery);

            if ( $playlistField['playlistID'] ) {
                //playlist with name already exists for user
                
                $playlistInfo = array(
                    "status" => 'exists'
                );

            } else {
                //new playlist, continue

                $sql="SELECT playlistID FROM `playlistTracks` ORDER BY playlistID DESC LIMIT 1";
                $result =mysql_query($sql);

                while ($data=mysql_fetch_assoc($result)){

                    $playlistID = $data['playlistID']+1;

                }

                //if playlist ids arnt found start new id at 1
                if ( !$playlistID ) {
                    $playlistID = 1;
                }

                mysql_query("INSERT INTO `playlistTracks` (`id`,`playlistID`, `userID`, `name`) VALUES (null,$playlistID,'$userID','$name')");

                //return new id for playlist
                $playlistInfo = array(
                    "status" => 'created',
                    "PID" => $playlistID    
                );

            }

        }

        echo json_encode( $playlistInfo );

    }

?>