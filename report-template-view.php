<?php
require_once("data/db_connect.php");
testConnection();

session_start();

if (!isset($_SESSION["currentUser"])) {
    header("location: index.php");
} else {
    $currentUser = $_SESSION["currentUser"];
}

if (isset($_GET["id"])) {
    $id = $_GET["id"];
} else {
    header('Location: menu.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Open ES</title>

    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/report-template-editor.css">
    <link rel="stylesheet" href="css/report-template-view.css">

    <!--JQuery-->
    <script src="lib/jquery-3.4.1.min.js"></script>

    <!--JQuery alert-->
    <script src="lib/jquery-confirm/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="lib/jquery-confirm/jquery-confirm.min.css">
    
    <script src="js/editor-common.js"></script>
    <script src="js/objects/report-template.js"></script>
    <script src="js/alert.js"></script>
    <script src="js/report-template-view/main.js"></script>
</head>
<body>
    <header>
        <button onclick ="window.location = 'menu.php';" id="back-button">Back</button>
        <button <?=$currentUser["is_admin"]?"":"hidden"?> onclick = "window.location = 'report-template-editor.php?id=<?=$id?>'">Edit</button>
        <button <?=$currentUser["is_admin"]?"":"hidden"?> onclick = "deleteWarning()">Delete</button>
    </header>
    <input id="template-id" hidden value="<?=$id?>">
    <div id="container">
        <div id="template-name"><b>Expert system:</b> <span id="template-name-span"></span></div>
        <table id="items-table">
            <thead>
                <tr>
                    <th>Element name</th>
                    <th>Prolog facts</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody id="table-data">
            </tbody>
        </table>
    </div>
    <div class="flex-filler"></div>
</body>
</html>