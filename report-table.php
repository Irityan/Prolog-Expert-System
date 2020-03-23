<?php

	require_once("data/db_connect.php");
	testConnection();

	session_start();
	if (!isset($_SESSION["currentUser"])) {
		header("location: index.php");
	}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<title>Insert data</title>
	
	<link rel="stylesheet" href="css/report-template-editor.css">

	<link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/animations.css">
	<link rel="stylesheet" type="text/css" href="css/header.css">
	
	<script src="lib/jquery-3.4.1.min.js"></script>

    <!--JQuery alert-->
    <script src="lib/jquery-confirm/jquery-confirm.min.js"></script>
	<link rel="stylesheet" href="lib/jquery-confirm/jquery-confirm.min.css">
	
	<link rel="stylesheet" href="css/alert.css">
    <script src="js/alert.js"></script>
	<script src="js/editor-common.js"></script>
	
	<link rel="stylesheet" href="css/report-table.css">

	<script src="lib/tau-prolog.js"></script>
	<script src="js/prolog/prolog-helper.js"></script>
	<script src="js/prolog/main.js"></script>
	
</head>
<body>
	<header>
		<button onclick="window.location = 'index.php'">Back</button>
		<button onclick="newReport()" id="new-button">Insert data into KB</button>
	</header>
	
	<div id="container">
		<div id="prolog-filter">
			<input id="prolog-command" type="text" placeholder="Insert Prolog rules......">
			<select id="prolog-predicats">

			</select>
			<button class="normal-button" type="button" onclick="addCommand()">+</button>
			<button class="normal-button" type="button" onclick="filterProlog()">Search</button>
			<button class="normal-button" type="button" onclick="resetFilters()">Update</button>
		</div>
		<table id="reports-table">
			<thead></thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="flex-filler">
	</div>
	<script src="js/report-table/main.js"></script>
</body>
</html>