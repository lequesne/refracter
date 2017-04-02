<?php require('includes/config.php');

//response object
$responseObject = Array();
$responseObject['success'] = false;

if ( $_GET['key'] ) {

	$stmt = $db->prepare('SELECT resetToken, resetComplete FROM users WHERE resetToken = :token');
	$stmt->execute(array(':token' => $_GET['key']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	//if no token from db then kill the page
	if(empty($row['resetToken'])){
		$stop = 'Invalid token provided, please use the link provided in the reset email.';
	} elseif($row['resetComplete'] == 'Yes') {
		$stop = 'Your password has already been changed!';
	}

	//basic validation
	if(strlen($_GET['password']) < 3){
		$error[] = 'Password is too short.';
	}

	if(strlen($_GET['passwordConfirm']) < 3){
		$error[] = 'Confirm password is too short.';
	}

	if($_GET['password'] != $_GET['passwordConfirm']){
		$error[] = 'Passwords do not match.';
	}

	//if no errors have been created carry on
	if(!isset($error)){

		//hash the password
		$hashedpassword = $user->password_hash($_GET['password'], PASSWORD_BCRYPT);

		try {

			$stmt = $db->prepare("UPDATE users SET password = :hashedpassword, resetComplete = 'Yes'  WHERE resetToken = :token");
			$stmt->execute(array(
				':hashedpassword' => $hashedpassword,
				':token' => $row['resetToken']
			));

			//password change success, possibly auto log user in?
			$responseObject['success'] = true;


		//else catch the exception and show the error.
		} catch(PDOException $e) {
		    $error[] = $e->getMessage();
			$responseObject['success'] = false;
			$responseObject['errors'] = $error;
		}

	}

} else {
	$error[] = 'Your username or password is incorrect or you may not have activated your account from the activation email.';
	$responseObject['success'] = false;
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
