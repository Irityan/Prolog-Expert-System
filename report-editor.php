<?php
require_once("data/db_connect.php");
testConnection();

session_start();

if (!isset($_SESSION["currentUser"])) {
    header("location: index.php");
} else {
    $currentUser = $_SESSION["currentUser"];
}

if (!isset($_GET["templateid"]) || !isset($_GET["id"])) {
    echo "Не указаны id!";
    exit();
} else {
    $id = $_GET["id"];
    $templateId = $_GET["templateid"];
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>
        Update data
    </title>

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/animations.css">
    <link rel="stylesheet" type="text/css" href="css/header.css">

    <script src="lib/jquery-3.4.1.min.js"></script>

    <!--JQuery alert-->
    <script src="lib/jquery-confirm/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="lib/jquery-confirm/jquery-confirm.min.css">

    <link rel="stylesheet" href="css/report-template-editor.css">
    <link rel="stylesheet" href="css/report-editor.css">

    <link rel="stylesheet" href="css/alert.css">
    <script src="js/alert.js"></script>
    <script src="js/editor-common.js"></script>
    <script src="js/report-editor/main.js"></script>

</head>
<body>
    <header>
        <button onclick ="exitWarning('report-table.php')" id="back-button">Back</button>
        <button onclick = "<?=$id>0? 'updateReport()':'insertReport()'?>" id="save-button">Save</button>
        <?=$id>0? "<button onclick = 'deleteWarning($id)'>Удалить</button>": ""?>
    </header>

    <input hidden id="report-id" value="<?=$id?>">
    <input hidden id="template-id" value="<?=$templateId?>">

    <div id="container">
        <div id="name-input">
            <label for="report-name">Insert BN:</label>
            <input type="text" id="report-name" placeholder="Insert here..">
        </div> 
    </div>
    <div class="flex-filler">
	</div>
</body>
</html>