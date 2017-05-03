<?php

require('includes/config.php');
require "vendor/autoload.php";
use PHPHtmlParser\Dom;
header('Content-Type: application/json');

$responseObject = Array();
$responseObject['success'] = false;
$storedCookieValue = $_GET['key'];
$trackID = $_GET['trackID'];
$source = $_GET['source'];

//if user logged in
if($user->login(null,null,$storedCookieValue)) {

    //validate youtube source
    $dom = new Dom;
    $dom->loadFromFile('https://www.youtube.com/watch?v='.urlencode($source));

    if ( count($dom->find('.watch-title')) > 0 ) {
        //source is valid youtube video

        if ( $trackID && $source ) {
            //check usertracks table for existing entry

            //update user track
            $stmt = $db->prepare('UPDATE userTracks SET source = :source WHERE userID = :userID AND trackID = :trackID');
            $stmt->execute(array(
                ':source' => $source,
                ':userID' => $_SESSION['userID'],
                ':trackID' => $trackID
            ));

            if ( $stmt->rowCount() === 0 ) {
                //track wasnt updated as track wasnt already saved, create new user track entry with new source

                $stmt = $db->prepare('INSERT INTO userTracks (userTrackID,userID,trackID,source) VALUES (:userTrackID,:userID,:trackID,:source)');
        		$stmt->execute(array(
        			':userTrackID' => NULL,
        			':userID' => $_SESSION['userID'],
        			':trackID' => $trackID,
                    ':source' => $source
        		));

            }

            $responseObject['success'] = true;

        }

    } else {
        $error[] = 'The YouTube source provided was not a valid YouTube video.';
    	$responseObject['errors'] = $error;
    }

} else {
    $error[] = 'User could not be authenticated with provided key.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
