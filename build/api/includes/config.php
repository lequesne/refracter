<?php

ob_start();
session_start();

$thisFileLocation = $_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'];
$appUrl = 'http://'.strstr($thisFileLocation, 'api', true);
$apiEndPoint = $appUrl.'api/';
$cookieName = 'refracted';

//set timezone
date_default_timezone_set('Australia/Sydney');

//if local or production
if (strpos(__FILE__, '_code') !== FALSE){
    define ('SITE_TYPE', DEV_SITE);
} else {
   define ('SITE_TYPE', LIVE_SITE);
}

//define db connection details
switch (SITE_TYPE) {
    case DEV_SITE:
        define('DBHOST','localhost');
        define('DBUSER','root');
        define('DBPASS','mysql');
        define('DBNAME','refracter');
        break;
    case LIVE_SITE:
        define('DBHOST','localhost');
        define('DBUSER','root');
        define('DBPASS','Mickeymouse#1');
        define('DBNAME','refracter');
        break;
}


//application email address
define('SITEEMAIL','refracter.app@gmail.com');
define('DIR', $appUrl);

try {
	//create PDO connection
	$db = new PDO("mysql:host=".DBHOST.";dbname=".DBNAME, DBUSER, DBPASS);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
	//show error
    echo '<p class="bg-danger">'.$e->getMessage().'</p>';
    exit;
}

//include the user class, pass in the database connection
include('classes/user.php');
include('classes/phpmailer/mail.php');
$user = new User($db);
?>
