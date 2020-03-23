<?php
require_once("data/db_connect.php");
testConnection();

session_start();

if (!isset($_SESSION["currentUser"])) {
    header("location: index.php");
} else {
    $currentUser = $_SESSION["currentUser"];
}

if (isset($_GET['logout'])) {
	session_destroy();
	header("location: index.php");
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>MAIN FORM</title>

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/animations.css">
    <link rel="stylesheet" type="text/css" href="css/header.css">
    <link rel="stylesheet" type="text/css" href="css/mainmenu.css">

    <script src="lib/jquery-3.4.1.min.js"></script>

    <script src="js/mainmenu/main.js"></script>
    <script src="js/objects/report-template.js"></script>
</head>
<body>
    <header><h1>MAIN FORM</h1></header>
    <div id="container">

        <div id="currentTemplateDiv">
            <select id="currentTemplate">
            <select>
        </div>


        <div class="flex-filler"></div>

        <div style="background: green"></div>

        <div id="menu-buttons">

            <input hidden id="user-id" value="<?=$currentUser["id"]?>">
            <input hidden id="is-admin" value="<?=$currentUser["is_admin"]?>">

            <button <?=$currentUser["is_admin"]?"":"style = 'display:none'"?> id ="admin-button" onClick ="window.location='admin/index.php'">
            Users <img src="img/users.png" alt=" ">
            </button>

            <button <?=$currentUser["is_admin"]?"":"disabled"?> onClick ="window.location='report-template-editor.php'" id="new-template-button">
            <span>New Expert System</span> <img src="img/newTemplate.png" alt=" ">
            </button>


            <button onClick ="openTemplateViewer()" id="open-template-button">
            Open Expert System <img src="img/openTemplate.png" alt=" ">
            </button>

            <button onClick ="window.location='report-table.php'" id="table-button">
                Knowledge base <img src="img/table.png" alt=" ">
            </button>

            <button onClick ="window.location='prolog-module.php'" id="prolog-button">
               Prolog modules <img src="img/prolog.png" alt=" ">
            </button>

            <button  onClick ="window.location='help.html'" id="help-button">
                Help <img src="img/help.png" alt=" ">
            </button>

            <button onclick="logout()" id="exitButton">
            Exit <img src="img/exit.png" alt=" ">
            </button>
        </div>
        
        <div class="flex-filler"></div>
    </div>
</body>
</html>