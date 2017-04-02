<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$albumTrackData = json_decode(file_get_contents('php://input'), true);

//for each loop to insert into database
if ( $albumTrackData ) {

    $albumTracks = array();

    foreach( $albumTrackData as $trackData ){

        //insert this track into db
        $stmt = $db->prepare('INSERT INTO tracks (trackID,number,title,album,artist,duration,art,type) VALUES (:trackID,:number,:title,:album,:artist,:duration,:art,:type)');
		$stmt->execute(array(
			':trackID' => NULL,
			':number' => $trackData['number'],
			':title' => $trackData['title'],
			':album' => $trackData['album'],
            ':artist' => $trackData['artist'],
            ':duration' => $trackData['duration'],
            ':art' => $trackData['art'],
            ':type' => $trackData['type']
		));

        //get new trackID for track
        $newTrackID = $db->lastInsertId('trackID');

        //response data for newly added track
        $newTrackData = array(
			'trackID' => $newTrackID,
			'number' => $trackData['number'],
			'title' => $trackData['title'],
			'album' => $trackData['album'],
            'artist' => $trackData['artist'],
            'duration' => $trackData['duration'],
            'art' => $trackData['art'],
            'type' => $trackData['type']
		);

        //push track to album response object
        array_push($albumTracks , $newTrackData);

    }

    //new tracks added, respond with array of tracks for album
    $responseObject['success'] = true;
    $responseObject['tracks'] = $albumTracks;

} else {
    $error[] = 'addAlbum requires a post of track data for the album.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
