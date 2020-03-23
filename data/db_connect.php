<?php
//error_reporting(E_ERROR | E_PARSE);

require_once $_SERVER['DOCUMENT_ROOT'] . "/rat/settings.php";

$connect = null;

function makeConnection() {
	global $connect, $dbPath, $username, $password, $dbName;
	$connect = new mysqli($dbPath, $username, $password, $dbName);

	if ($connect->connect_error) {
		require_once("error.html");
		exit();
	} else {
		header('Content-Type: text/html; charset=utf-8');
		mysqli_set_charset($connect,'utf8');
	}
}

function testConnection() {
	global $dbPath, $username, $password, $dbName;
	$connect = new mysqli($dbPath, $username, $password, $dbName);

	if ($connect->connect_error) {
		require_once("error.html");
		exit();
	} else {
		$connect->close();
	}
}

function e($val){
	global $connect;
	return mysqli_real_escape_string($connect, trim($val));
}
?>