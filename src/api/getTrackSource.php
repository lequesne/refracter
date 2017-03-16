<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$trackID = $_GET['trackID'];
$storedCookieValue = $_GET['key'];

//if user logged in
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
        doSourceVote();
    }

} else {
    //use existing sources from other users
    doSourceVote();
}

function doSourceVote() {
    //do count of most used sources for a track

    // TODO: UPDATE QUERY AND SOURCE VOTE FUNCTION BELOW 

    $trackArr = array();
    $trackQuery = mysql_query("SELECT * FROM userTracks WHERE trackID='$trackID' ");
    $trackField = mysql_fetch_assoc($trackQuery);

    if ( $trackField['source'] ) {

        do {

            if ( $trackField['source'] )
                array_push( $trackArr , $trackField['source'] );

        } while ( $trackField = mysql_fetch_assoc($trackQuery) );

        //echo back highest rated source for track id
        $countedArray = array_count_values( $trackArr );
        echo json_encode( array_search(max($countedArray), $countedArray) );

    } else {
        //no sources for the track exist

        echo json_encode( false );

    }

}

echo json_encode($responseObject);

?>
