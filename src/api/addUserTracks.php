<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$postData = json_decode(file_get_contents('php://input'), true);
$storedCookieValue = $postData['key'];
$trackIDs = $postData['tracks'];
$playlistID = $postData['playlistID'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

    if ( $playlistID ) {
        //playlist id so add to playlist as well

        // TODO add playlist tracks to db

        //for each loop to insert into database
        // foreach( $data as $d ){
        //
        //     $trackID = mysql_real_escape_string($d['trackID']);
        //
        //     mysql_query("INSERT INTO `playlistTracks` (`id`,`playlistID`,`userID`,`trackID`,`name`) VALUES (null ,'$pid','$userID','$trackID','$name')");
        //
        // }

    } else {

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


    //$data = $_POST['data'];
    //$pid = mysql_real_escape_string($_POST['pid']);
    //$name = mysql_real_escape_string($_POST['name']);

    // if ( $pid ) {
    //     //add to playlist
    //
    //     //for each loop to insert into database
    //     foreach( $data as $d ){
    //
    //         $trackID = mysql_real_escape_string($d['trackID']);
    //
    //         mysql_query("INSERT INTO `playlistTracks` (`id`,`playlistID`,`userID`,`trackID`,`name`) VALUES (null ,'$pid','$userID','$trackID','$name')");
    //
    //     }
    //
    //     echo json_encode('tracks added to '.$name);
    //
    // } else {
    //     //add to library
    //
    //     //for each loop to insert into database
    //     foreach( $data as $d ){
    //
    //         $trackID = mysql_real_escape_string($d['trackID']);
    //
    //         $q = mysql_query("SELECT * FROM `userTracks` WHERE `trackID`='$trackID' AND `userID`='$userID'");
    //
    //         $rowNum = mysql_num_rows($q);
    //
    //         //if matches found then add to tracks to an array
    //         if ( $rowNum === 0 ) {
    //
    //             $SQL = "INSERT INTO `userTracks` (`userTrackID`, `userID`, `trackID`) VALUES (NULL,'$userID','$trackID')";
    //
    //             //insert query
    //             mysql_query($SQL);
    //
    //         }
    //
    //     }
    //
    //     echo json_encode('tracks added');
    //
    // }

?>
