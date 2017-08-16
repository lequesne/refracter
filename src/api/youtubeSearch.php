<?php

require('includes/config.php');
require "vendor/autoload.php";
use PHPHtmlParser\Dom;
header('Content-Type: application/json');

$responseObject = Array();
$responseObject['success'] = false;
$query = $_GET['query'];

//create new dom object to load html from request page
$dom = new Dom;
$dom->loadFromFile('https://www.youtube.com/results?q='.urlencode($query));
$resultsList = $dom->find('.item-section > li');

//for each li result
foreach ($resultsList as $result) {

    //identify if video by link matches
    $resultLink = $result->find('.yt-lockup-title > a');
    $resultHref = $resultLink->getAttribute('href');

    if (strpos($resultHref, '/watch?v=') !== false && strpos($resultHref, 'list=') === false ) {
        //result is a video link

        //scrap markup and add to result object
        $resultObject['title'] = $resultLink->innerHtml;
        $resultObject['youTubeURL'] = 'https://www.youtube.com'.$resultHref;
        $resultObject['youTubeID'] = str_replace("/watch?v=","",$resultHref);
        $resultObject['duration'] = $result->find('.yt-lockup-thumbnail .video-time')[0]->innerHtml;
        $resultObject['author'] = $result->find('.yt-lockup-byline > a')->innerHtml;
        $resultObject['date'] = $result->find('.yt-lockup-meta-info li')[0]->innerHtml;
        $resultObject['views'] = $result->find('.yt-lockup-meta-info li')[1]->innerHtml;
        $resultObject['desc'] = $result->find('.yt-lockup-description')[0]->innerHtml;

        //push result to array
        $videoResults[] = $resultObject;

    }

}

if ( $videoResults ) {
    $responseObject['success'] = true;
    $responseObject['results'] = $videoResults;
} else {
    $error[] = 'No YouTube Ids were found.';
    $responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
