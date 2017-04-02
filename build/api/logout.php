<?php require('includes/config.php');

//logout
$user->logout();
echo json_encode(true);

?>
