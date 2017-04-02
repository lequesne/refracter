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

        $userHasAlbumInLibrary = true;

        foreach ( $albumTracks as $track ) {

            $stmt = $db->prepare('SELECT * FROM userTracks WHERE userID = :userID AND trackID = :trackID');
            $stmt->execute(array(
                ':userID' => $_SESSION['userID'],
                ':trackID' => $track['trackID']
            ));
            $userHasTrack = $stmt->fetch(PDO::FETCH_ASSOC);

            if ( !$userHasTrack ) {
                $userHasAlbumInLibrary = false;
                break;
            }

        }

        //return albumInLibrary based off if user has all the tracks in the album in their library
        $responseObject['albumInLibrary'] = $userHasAlbumInLibrary;
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
