<?php
//include config
require_once('includes/config.php');

//check if already logged in move to home page
//if( $user->is_logged_in() ){ header('Location: index.php'); }

$username = $_GET['username'];
$password = $_GET['password'];

$responseObject = Array();
$responseObject['success'] = false;

if($user->login($username,$password)){
	//logged in, echo back some user data for proof
	$userData = Array();
	$userData['loggedin'] = $_SESSION['loggedin'];
	$userData['username'] = $_SESSION['username'];
	$userData['email'] = $_SESSION['email'];

	//create unique cookie value
	$cookieValue = md5(uniqid(rand(),true)).'|'.$_SESSION['username'];

	//store new cookie value in db
	$stmt = $db->prepare('UPDATE users SET cookie = :cookie WHERE username = :username ');
	$stmt->execute(array(
		':cookie' => $cookieValue,
		':username' => $_SESSION['username'],
	));

	//set cookie in host
	$cookieSet = setcookie($cookieName, $cookieValue, time() + (86400 * 30), "/"); // 86400 = 1 day

	//response object
	$responseObject['success'] = true;
	$responseObject['user'] = $userData;
	$responseObject['cookieSet'] = $cookieSet;
	$responseObject['cookieValue'] = $cookieValue;
	$responseObject['cookieName'] = 'refracted';
	echo json_encode($responseObject);
	exit;

} else {
	$error[] = 'Your username or password is incorrect or you may not have activated your account from the activation email.';
	$responseObject['success'] = false;
	$responseObject['errors'] = $error;
	echo json_encode($responseObject);
}

?>
