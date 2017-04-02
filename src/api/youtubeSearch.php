<?php require('includes/config.php');

$responseObject = Array();
$responseObject['success'] = false;
$query = $_GET['query'];

$doc = new DOMDocument();
@$doc->loadHTMLFile('https://www.youtube.com/results?q='.$query);
$links = $doc->getElementsByTagName('a');
foreach($links as $link) {
    $href = $link->getAttribute('href');
    if (strpos($href, '/watch?v=') !== false && strpos($href, 'list=') === false ) {
        $result[] = str_replace("/watch?v=","",$href);
    }
}
if ( $result ) {
    $responseObject['success'] = true;
    $responseObject['videos'] = $result;
} else {
    $error[] = 'No YouTube Ids were found.';
    $responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
