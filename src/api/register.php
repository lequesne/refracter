<?php require('includes/config.php');

//response object
$responseObject = Array();
$responseObject['success'] = false;

if(strlen($_GET['username']) < 3){
	$error[] = 'Username is too short.';
} else {
	$stmt = $db->prepare('SELECT username FROM users WHERE username = :username');
	$stmt->execute(array(':username' => $_GET['username']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['username'])){
		$error[] = 'Username provided is already in use.';
	}

}

if(strlen($_GET['password']) < 3){
	$error[] = 'Password is too short.';
}

if(strlen($_GET['passwordConfirm']) < 3){
	$error[] = 'Confirm password is too short.';
}

if($_GET['password'] != $_GET['passwordConfirm']){
	$error[] = 'Passwords do not match.';
}

//email validation
if(!filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)){
    $error[] = 'Please enter a valid email address';
} else {
	$stmt = $db->prepare('SELECT email FROM users WHERE email = :email');
	$stmt->execute(array(':email' => $_GET['email']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if(!empty($row['email'])){
		$error[] = 'Email provided is already in use.';
	}

}


//if no errors have been created carry on
if(!isset($error)){

	//hash the password
	$hashedpassword = $user->password_hash($_GET['password'], PASSWORD_BCRYPT);

	//create the activation code
	$activation = md5(uniqid(rand(),true));

	try {

		//insert into database with a prepared statement
		$stmt = $db->prepare('INSERT INTO users (username,password,email,active) VALUES (:username, :password, :email, :active)');
		$stmt->execute(array(
			':username' => $_GET['username'],
			':password' => $hashedpassword,
			':email' => $_GET['email'],
			':active' => $activation
		));
		$id = $db->lastInsertId('userID');

		//send email
		$to = $_GET['email'];
		$subject = "Registration Confirmation";
		$body = "
		<table width='100%' align='center'>
            <tr style='background-color: #333333;'>
                <td align='center' style='text-align:center;'>
                    <img align='center' width='100%' style='max-width: 600px; width:100%;' src='http://i.imgur.com/R7HPn2q.jpg' alt='Refracter'/>
                </td>
            </tr>
        </table>
		<p>Welcome to Refracter, a music aggregator and YouTube player in one.</p>
		<p>To activate your account, please visit the following link: <a href='".DIR."?userID=$id&active=$activation'>".DIR."?userID=$id&active=$activation</a></p>";

		$mail = new Mail();
		$mail->isSMTP();
		//$mail->setFrom(SITEEMAIL);
		$mail->addAddress($to);
		$mail->subject($subject);
		$mail->body($body);
		$mail->send();

		//registration success
		$responseObject['success'] = true;

	//else catch the exception and show the error.
	} catch(PDOException $e) {
	    $error[] = $e->getMessage();
		$responseObject['errors'] = $error;
	}

} else {
	$responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
