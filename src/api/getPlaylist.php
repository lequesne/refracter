<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$playlistID = $_GET['playlistID'];

if ($playlistID) {

    //get playlist tracks matching playlist id
    $stmt = $db->prepare('SELECT t.* FROM playlistTracks u JOIN tracks t ON t.trackID = u.trackID WHERE u.playlistID = :playlistID');
    $stmt->execute(array(
        ':playlistID' => $playlistID
    ));
    $playlistTracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //get playlist name
    $stmt = $db->prepare('SELECT * FROM playlistTracks WHERE playlistID = :playlistID');
    $stmt->execute(array(
        ':playlistID' => $playlistID
    ));
    $playlistTrackField = $stmt->fetch(PDO::FETCH_ASSOC);

    $responseObject['playlistName'] = $playlistTrackField['name'];
    $responseObject['playlistTracks'] = $playlistTracks;
    $responseObject['playlistID'] = $playlistID;
    $responseObject['success'] = true;


} else {
    $error[] = 'getPlaylist requires a playlist id paramater.';
}

echo json_encode($responseObject);

?>
