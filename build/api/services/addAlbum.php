<?php

include("headers.php");

    $data = json_decode(file_get_contents('php://input'), true);
    $arr = array();

    //for each loop to insert into database
    foreach( $data as $d ){

        $newNumber = mysql_real_escape_string($d['number']);
        $newTitle = mysql_real_escape_string($d['title']);
        $newAlbum = mysql_real_escape_string($d['album']);
        $newArtist = mysql_real_escape_string($d['artist']);
        $newDuration = mysql_real_escape_string($d['duration']);
        $newArt = mysql_real_escape_string($d['art']);
        $newType = mysql_real_escape_string($d['type']);

        $SQL = "INSERT INTO `tracks` (`trackID`, `number`, `title`, `album`, `artist`, `duration`, `art`, `type`) VALUES (NULL,'$newNumber','$newTitle','$newAlbum','$newArtist','$newDuration','$newArt','$newType')"; //or die(mysql_error());

        //insert query
        mysql_query($SQL);

        $trackID = mysql_insert_id();

        //push vales to object
        $var = array(
            "trackID" => $trackID,
            "number" => $d['number'],
            "title" => $d['title'],
            "album" => $d['album'],
            "artist" => $d['artist'],
            "duration" => $d['duration'],
            "art" => $d['art'],
            "type" => $d['type']
        );

        array_push($arr ,$var);

    }

    echo json_encode($arr);

?>
