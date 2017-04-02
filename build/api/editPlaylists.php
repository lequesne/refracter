<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$trackID = $_GET['trackID'];
$storedCookieValue = $_GET['key'];
$playlistName = $_GET['name'];
$playlistID = $_GET['playlistID'];

//if user authenticated
if ( $playlistName ) {

    if($user->login(null,null,$storedCookieValue)) {

        if ( $playlistID ) {
            //update name of existing playlist
            $stmt = $db->prepare('UPDATE playlistTracks SET name = :name WHERE userID = :userID AND playlistID = :playlistID');
            $stmt->execute(array(
                ':name' => $playlistName,
                ':playlistID' => $playlistID,
                ':userID' => $_SESSION['userID']
            ));
            $responseObject['message'] = 'Playlist name updated.';
            $responseObject['newPlaylistName'] = $playlistName;
            $responseObject['success'] = true;

        } else {
            //new playlist name
            //first check if a playlist of matching name exists for the user
            $stmt = $db->prepare('SELECT * FROM playlistTracks WHERE name = :name AND userID = :userID');
            $stmt->execute(array(
                ':name' => $playlistName,
                ':userID' => $_SESSION['userID']
            ));
            $playlistField = $stmt->fetch(PDO::FETCH_ASSOC);

            if ( $playlistField['playlistID'] ) {
                //playlist with name already exists for user
                $error[] = 'Playlist was not created because you already have a playlist of the same name.';
                $responseObject['errors'] = $error;
                $responseObject['success'] = false;
            } else {
                //new playlist, continue

                //generate unique id for new playlist
                $newPlaylistID = base_convert(microtime(false), 10, 36);

                //create new playlist in the database
                $stmt = $db->prepare('INSERT INTO playlistTracks (id, playlistID, userID, name) VALUES (null, :playlistID, :userID, :name)');
                $stmt->execute(array(
                    ':playlistID' => $newPlaylistID,
                    ':userID' => $_SESSION['userID'],
                    ':name' => $playlistName
                ));

                if ( $stmt ) {
                    //new playlist
                    $responseObject['message'] = 'New playlist created.';
                    $responseObject['newPlaylistID'] = $newPlaylistID;
                    $responseObject['newPlaylistName'] = $playlistName;
                    $responseObject['success'] = true;
                } else {
                    //error
                    $error[] = 'An issue occured whilst creating this playlist.';
                    $responseObject['errors'] = $error;
                }

            }

        }

    } else {
        $error[] = 'User could not be authenticated with provided key.';
    	$responseObject['errors'] = $error;
    }

} else {
    $error[] = 'Playlist name must not be empty.';
    $responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
