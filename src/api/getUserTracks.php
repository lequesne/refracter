<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$trackID = $_GET['trackID'];
$storedCookieValue = $_GET['key'];

//if user authenticated
if($user->login(null,null,$storedCookieValue)){

    $stmt = $db->prepare('SELECT t.* FROM tracks t INNER JOIN userTracks ut ON t.trackId = ut.trackId AND ut.userID = :userID');
    $stmt->execute(array(
        ':userID' => $_SESSION['userID']
    ));
    $userTracks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ( $userTracks ) {
        $responseObject['success'] = true;
        $responseObject['userTracks'] = $userTracks;
    } else {
        $responseObject['success'] = true;
        $responseObject['userTracks'] = [];
    }

} else {
    $error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
