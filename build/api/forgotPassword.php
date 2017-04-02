<?php require('includes/config.php');

//response object
$responseObject = Array();
$responseObject['success'] = false;

//email validation
if(!filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)){
    $error[] = 'Please enter a valid email address';
} else {
	$stmt = $db->prepare('SELECT email FROM users WHERE email = :email');
	$stmt->execute(array(':email' => $_GET['email']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if(empty($row['email'])){
		$error[] = 'Email provided is not on recognised.';
	}

}

//if no errors have been created carry on
if(!isset($error)){

	//create the activasion code
	$token = md5(uniqid(rand(),true));

	try {

		$stmt = $db->prepare("UPDATE users SET resetToken = :token, resetComplete='No' WHERE email = :email");
		$stmt->execute(array(
			':email' => $row['email'],
			':token' => $token
		));

		//send email
		$to = $row['email'];
		$subject = "Password Reset";
		$body = "
        <table width='100%' align='center'>
            <tr style='background-color: #333333;'>
                <td align='center' style='text-align:center;'>
                    <img align='center' width='100%' style='max-width: 600px; width:100%;' src='http://i.imgur.com/R7HPn2q.jpg' alt='Refracter'/>
                </td>
            </tr>
        </table>
        <p>Someone has requested that your password be reset.</p>
		<p>If this was a mistake or was not you, just ignore this email and nothing will happen.</p>
		<p>To reset your password, visit the following address: <a href='".DIR."?pwReset=$token'>".DIR."?pwReset=$token</a></p>";

		$mail = new Mail();
		$mail->isSMTP();
		//$mail->setFrom('Refracter');
		$mail->addAddress($to);
		$mail->subject($subject);
		$mail->body($body);
		$mail->send();

        //password link sent success
		$responseObject['success'] = true;

	//else catch the exception and show the error.
	} catch(PDOException $e) {
	    $error[] = $e->getMessage();
        $responseObject['success'] = false;
		$responseObject['errors'] = $error;
	}

} else {
    $responseObject['success'] = false;
    $responseObject['errors'] = $error;
}

echo json_encode($responseObject);

?>
