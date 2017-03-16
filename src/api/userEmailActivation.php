<?php

require('includes/config.php');

//response object
$responseObject = Array();
$responseObject['success'] = false;

//collect values from the url
$userID = trim($_GET['userID']);
$active = trim($_GET['active']);

//if id is number and the active token is not empty carry on
if(is_numeric($userID) && !empty($active)){

	//update users record set the active column to Yes where the userID and active value match the ones provided in the array
	$stmt = $db->prepare("UPDATE users SET active = 'Yes' WHERE userID = :userID AND active = :active");
	$stmt->execute(array(
		':userID' => $userID,
		':active' => $active
	));

	//if the row was updated redirect the user
	if($stmt->rowCount() == 1){
		//success
		$responseObject['success'] = true;

	} else {
		$error[] = 'There was an issue activating your account. Please try registering again.';
		$responseObject['success'] = false;
		if(isset($error)){
			$responseObject['errors'] = $error;
		}
	}

}
echo json_encode($responseObject);
?>
