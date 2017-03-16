<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$album = $_GET['album'];
$artist = $_GET['artist'];

if ( $album && $artist ) {

    //fetch tracks matching album name and artist
    $stmt = $db->prepare('SELECT * FROM tracks WHERE album = :album AND artist = :artist');
    $stmt->execute(array(
        ':album' => $album,
        ':artist' => $artist
    ));
    $albumTracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ( $albumTracks ) {
        //tracks were found so return in response object
        $responseObject['success'] = true;
        $responseObject['tracks'] = $albumTracks;
    }

} else {
    $error[] = 'getAlbum requires album and artist paramaters.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
