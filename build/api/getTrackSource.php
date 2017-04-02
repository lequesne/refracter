<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$trackID = $_GET['trackID'];
$storedCookieValue = $_GET['key'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

    //check to see if there is a user saved source first
    $stmt = $db->prepare('SELECT * FROM userTracks WHERE userID = :userID AND trackID = :trackID');
    $stmt->execute(array(
        ':userID' => $_SESSION['userID'],
        ':trackID' => $trackID
    ));
    $track = $stmt->fetch(PDO::FETCH_ASSOC);

    if ( $track['source'] ) {
        //user has a saved source
        $responseObject['success'] = true;
        $responseObject['source'] = $track['source'];
    } else {
        //no saved source so use existing sources from other users
        $responseObject['success'] = true;
        $responseObject['source'] = doSourceVote($db, $trackID);
    }

} else {
    //not logged in so use existing sources from other users
    $responseObject['success'] = true;
    $responseObject['source'] = doSourceVote($db, $trackID);
}

function doSourceVote($db, $trackID) {
    //do count of most used sources for a track
    $stmt = $db->prepare('SELECT * FROM userTracks WHERE trackID = :trackID');
    $stmt->execute(array(
        ':trackID' => $trackID
    ));
    $tracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ( $tracks ) {
        $trackSources = array();
        foreach ( $tracks as $track ) {
            if ( $track['source'] )
                array_push( $trackSources , $track['source'] );
        }
        if ( !empty($trackSources) ) {
            $countedArray = array_count_values( $trackSources );
            $mostUsedSource = array_search(max($countedArray), $countedArray);
            return $mostUsedSource;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

echo json_encode($responseObject);

?>
