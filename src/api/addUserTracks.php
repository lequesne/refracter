<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$postData = json_decode(file_get_contents('php://input'), true);
$storedCookieValue = $postData['key'];
$trackIDs = $postData['tracks'];
$playlistID = $postData['playlistID'];
$playlistName = $postData['playlistName'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

    if ( $playlistID && $playlistName ) {
        //playlist id and name so add to playlist

        foreach ( $trackIDs as $trackID ) {

            $stmt = $db->prepare('INSERT INTO playlistTracks (id,playlistID,userID,trackID,name) VALUES (null,:playlistID,:userID,:trackID,:name)');
            $stmt->execute(array(
                ':playlistID' => $playlistID,
                ':userID' => $_SESSION['userID'],
                ':trackID' => $trackID,
                ':name' => $playlistName
            ));

        }

        $responseObject['playlistID'] = $playlistID;
        $responseObject['playlistName'] = $playlistName;
        $responseObject['success'] = true;

    } else {
        //no playlist info so assume adding to library

        foreach ( $trackIDs as $trackID ) {

            //first check if entry for trackID/userID exists
            $stmt = $db->prepare('SELECT * FROM userTracks WHERE trackID = :trackID AND userID = :userID');
    		$stmt->execute(array(
    			':userID' => $_SESSION['userID'],
    			':trackID' => $trackID
    		));
            $existingTrack = $stmt->fetch(PDO::FETCH_ASSOC);

            if ( $existingTrack === false ) {
                //user track isnt already saved so insert new track
                $stmt = $db->prepare('INSERT INTO userTracks (userTrackID,userID,trackID) VALUES (:userTrackID,:userID,:trackID)');
        		$stmt->execute(array(
        			':userTrackID' => NULL,
        			':userID' => $_SESSION['userID'],
        			':trackID' => $trackID
        		));
            }

        }

    }

    $responseObject['success'] = true;

} else {
    $error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
