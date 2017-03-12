<?php

include("headers.php");

    $album = mysql_real_escape_string($_GET["album"]);
    $artist = mysql_real_escape_string($_GET["artist"]);

    //query tracks table for tracks with matchign album and artist
    $trackQuery = "SELECT * FROM `tracks` WHERE `album`='$album' AND `artist`='$artist'";
    $trackQueryResult = mysql_query( $trackQuery );
    $trackField = mysql_fetch_array( $trackQueryResult, MYSQL_ASSOC );

    $trackArr = array();

    if ( $trackField )  {

        //if matches found then add to tracks to an array and echo
        do {

            array_push($trackArr ,$trackField);

        } while ($trackField = mysql_fetch_array( $trackQueryResult , MYSQL_ASSOC ));

        echo json_encode($trackArr);

    } else {

        echo json_encode(false);
    }

?>
