<?php

	require_once("data/db_connect.php");
	testConnection();

	session_start();
	if (!isset($_SESSION["currentUser"])) {
		header("location: index.php");
	}

	$id = -1;
	if (isset($_GET["id"])) {
		$id = $_GET["id"];
	}
?>

<!DOCTYPE html>
<html lang="ru">
	<head>
		<title>New ES</title>
		<meta charset="utf-8">
		<link rel="stylesheet" href="css/main.css">
		<link rel="stylesheet" href="css/animations.css">
		<link rel="stylesheet" href="css/report-template-editor.css">
		<link rel="stylesheet" href="css/header.css">
		
		<!--JQuery-->
		<script src="lib/jquery-3.4.1.min.js"></script>

		<!--JQuery alert-->
		<script src="lib/jquery-confirm/jquery-confirm.min.js"></script>
		<link rel="stylesheet" href="lib/jquery-confirm/jquery-confirm.min.css">

		<!--JQuery UI-->
		<script src="lib/jquery-ui-1.12.1/jquery-ui.min.js"></script>
		<link rel="stylesheet" href="lib/jquery-ui-1.12.1/jquery-ui.min.css">
		<link rel="stylesheet" href="css/alert.css">
		

		<link rel="stylesheet" href="css/sortable.css">

		<script src="js/objects/report-template.js"></script>
		<script src="js/alert.js"></script>
		<script src="js/report-template-editor/report-template-table.js"></script>
		<script src="js/prolog/prolog-helper.js"></script>

		<script src="js/editor-common.js"></script>
		<script src = "js/report-template-editor/main.js"></script>
		
	</head>
	<body>
		<header>
			<button onclick ="exitWarning('menu.php')" id="back-button">Back</button>
			<button onclick = "<?=($id > 0)? 'tryUpdate()':'insertTemplate()'; ?>" id="save-button">Save</button>
		</header>
		<div id="container">
			<input hidden id ="templateId" value="<?=$id?>">
			<div id="name-input">
					<label for="template-name">ES name:</label>
					<input type="text" id="template-name" placeholder="A prototype name (rule: reportName)">
			</div>

			<hr>

			<table id="items-table">
				<thead>
					<tr>
						<th>Element name</th>
						<th>Prolog facts</th>
						<th>Input type</th>
						<th class="td-delete"></th>
					</tr>
				</thead>
				<tbody id="table-data">
				</tbody>
			</table>

			<hr>

			<div id="add-new-item">
				<input type="text" id="new-item-name" placeholder="Element name">
				<input type="text" id="new-item-prolog-name" placeholder="Prolog facts and rules">
				<select id ="new-item-type"></select>
				<button class="normal-button" onclick="addNewItem()">Insert</button>
			</div>

		</div>
		<div class="flex-filler">
		</div>
	</body>
</html>