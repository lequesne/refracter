<?php
//include config
require_once('includes/config.php');

$username = $_GET['username'];
$password = $_GET['password'];
$responseObject = Array();
$responseObject['success'] = false;

if($user->login($username,$password,null)){
	//logged in, echo back some user data for proof

	//create unique cookie value
	$cookieValue = md5(uniqid(rand(),true));

	//store new cookie value in db
	$stmt = $db->prepare('UPDATE users SET cookie = :cookie WHERE username = :username ');
	$stmt->execute(array(
		':cookie' => $cookieValue,
		':username' => $_SESSION['username'],
	));

	//return object with use data
	$responseObject['success'] = true;
	$responseObject['user'] = $user->getUserData();
	$responseObject['user']['cookie'] = $cookieValue;

} else {
	$error[] = 'Your username or password is incorrect or you may not have activated your account from the activation email.';
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
