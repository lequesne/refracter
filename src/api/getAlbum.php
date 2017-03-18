<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$album = $_GET['album'];
$artist = $_GET['artist'];
$storedCookieValue = $_GET['key'];

if ( $album && $artist ) {

    //fetch tracks matching album name and artist
    $stmt = $db->prepare('SELECT * FROM tracks WHERE album = :album AND artist = :artist');
    $stmt->execute(array(
        ':album' => $album,
        ':artist' => $artist
    ));
    $albumTracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //check if album is already saved
    if($user->login(null,null,$storedCookieValue)){

        //check if first track is in album
        $stmt = $db->prepare('SELECT * FROM userTracks WHERE userID = :userID AND trackID = :trackID');
        $stmt->execute(array(
            ':userID' => $_SESSION['userID'],
            ':trackID' => $albumTracks[0]['trackID']
        ));
        $userAlbumFirstTrack = $stmt->fetch(PDO::FETCH_ASSOC);

        //check if last track is in album
        $stmt = $db->prepare('SELECT * FROM userTracks WHERE userID = :userID AND trackID = :trackID');
        $stmt->execute(array(
            ':userID' => $_SESSION['userID'],
            ':trackID' => array_values(array_slice($albumTracks, -1))[0]['trackID']
        ));
        $userAlbumLastTrack = $stmt->fetch(PDO::FETCH_ASSOC);

        //first and last track in library so assume in library
        if ( $userAlbumFirstTrack && $userAlbumLastTrack ) {
            $responseObject['albumInLibrary'] = true;
        }
    }

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
