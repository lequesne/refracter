<?php

include("headers.php");

//remove remember me cookies
unset($_COOKIE['refracter_logged_in']);
setcookie('refracter_logged_in', null, -1, '/');
            
//IF USER IS STILL LOGGED IN
if($user){
    //LOGS USER OUT THE OLD-FASHIONED WAY AND GOES TO THE LOGIN PAGE
    session_unset();
    session_destroy();

    echo json_encode(true);
}
else //IF USER IS NOT LOGGED IN THE FIRST PLACE
{
    echo json_encode(false);
}

?>