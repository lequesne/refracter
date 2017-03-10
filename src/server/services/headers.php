<?php

	//live db
	/*
	$user_name = "root";
	$password = "Mickeymouse1#";
	$database = "refracterApp";
	$server = "localhost";
	*/
	
	//local db
	$user_name = "root";
	$password = "mysql";
	$database = "refracterApp";
	$server = "localhost";
	

	//STARTS THE SESSION
	session_start();
	$user = $_SESSION["user"];
	$userID = $_SESSION["userID"];

	//CONNECTS TO DATABASE (MODIFY TO YOUR SETTINGS)
	$c = mysql_connect($server, $user_name, $password);
	$db = mysql_select_db($database, $c);
	$table = "users";

	mysql_set_charset("utf8");

?>