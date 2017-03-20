<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$postData = json_decode(file_get_contents('php://input'), true);
$storedCookieValue = $postData['key'];
$trackIDs = $postData['tracks'];
$playlistID = $postData['playlistID']; //optional - will remove from corresponding id if included, otherwise library

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

    if ( $playlistID ) {
        //remove from playlist

        foreach ( $trackIDs as $trackID ) {

            $stmt = $db->prepare('DELETE FROM playlistTracks WHERE playlistID = :playlistID AND trackID = :trackID LIMIT 1');
            $stmt->execute(array(
                ':playlistID' => $playlistID,
                ':trackID' => $trackID
            ));

        }

        $responseObject['success'] = true;

    } else {
        //remove from library

        foreach ( $trackIDs as $trackID ) {

            $stmt = $db->prepare('DELETE FROM userTracks WHERE userID = :userID AND trackID = :trackID LIMIT 1');
            $stmt->execute(array(
                ':userID' => $_SESSION['userID'],
                ':trackID' => $trackID
            ));

        }

        $responseObject['success'] = true;

    }

} else {
    $error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
