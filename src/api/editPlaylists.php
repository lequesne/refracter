<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$trackID = $_GET['trackID'];
$storedCookieValue = $_GET['key'];
$playlistName = $_GET['name'];
$playlistID = $_GET['playlistID'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

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
            $error[] = 'User already has a playlist of that name.';
            $responseObject['errors'] = $error;
            $responseObject['success'] = false;
        } else {
            //new playlist, continue

            //$newplaylistID = null;

            //fetch all playlist ids in desc order
            $stmt = $db->prepare('SELECT playlistID FROM playlistTracks ORDER BY playlistID DESC LIMIT 1');
            $stmt->execute();
            $playlistIDs = $stmt->fetch(PDO::FETCH_ASSOC);

            // TODO fix bug in lines below

            //for each id count
            foreach ( $playlistIDs as $id ) {
                $newplaylistID = $id['playlistID']+1;
            }
            //if playlist ids arnt found start new id at 1
            if ( !$newplaylistID ) {
                $newplaylistID = 1;
            }

            //create new playlist in the database
            $stmt = $db->prepare('INSERT INTO playlistTracks (id, playlistID, userID, name) VALUES (null, :playlistID, :userID, :name)');
            $stmt->execute(array(
                ':playlistID' => $newplaylistID,
                ':userID' => $_SESSION['userID'],
                ':name' => $playlistName
            ));
            $newPlaylistRow = $stmt->fetch(PDO::FETCH_ASSOC);

            if ( $newPlaylistRow ) {
                //new playlist
                $responseObject['message'] = 'New playlist created.';
                $responseObject['newplaylistID'] = $newplaylistID;
                $responseObject['newPlaylistName'] = $playlistName;
                $responseObject['success'] = true;
            } else {
                //error
                $error[] = 'An issue occured whilst creating this playlist.';
                $responseObject['errors'] = $error;
                $responseObject['success'] = false;
            }

        }

    }

} else {
    $error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
    $responseObject['success'] = false;
}

echo json_encode($responseObject);

?>
