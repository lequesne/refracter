<?php

include("headers.php");

    $tracks = $_POST['tracks'];
    $label = $_POST['label'];

    if ( $label === 'Library' ) {
        //remove track ids from users library

        foreach( $tracks as $d ){

            mysql_query("DELETE FROM userTracks WHERE userID='$userID' AND trackID='$d' LIMIT 1");

        }

    } else {
        //remove track ids from users specified playlist

        foreach( $tracks as $d ){

            mysql_query("DELETE FROM playlistTracks WHERE playlistID='$label' AND trackID='$d' LIMIT 1");

        }

    }

?>