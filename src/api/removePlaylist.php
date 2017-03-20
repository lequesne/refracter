<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$playlistID = $_GET['playlistID'];
$storedCookieValue = $_GET['key'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

	if ( $playlistID ) {

		//mysql_query("UPDATE `playlistTracks` SET `userID`=-1 WHERE `playlistID`='$pid' ");

		$stmt = $db->prepare('DELETE FROM playlistTracks WHERE userID = :userID AND playlistID = :playlistID');
		$stmt->execute(array(
			':userID' => $_SESSION['userID'],
			':playlistID' => $playlistID
		));

		$responseObject['message'] = 'Playlist was deleted';
		$responseObject['success'] = true;

	} else {
		$error[] = 'No playlist id was provided.';
		$responseObject['errors'] = $error;
	}

} else {
	$error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
