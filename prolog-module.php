<?php

require_once("data/db_connect.php");
testConnection();

session_start();

if (!isset($_SESSION["currentUser"])) {
    header("location: index.php");
} else {
    $currentUser = $_SESSION["currentUser"];
}

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Prolog module</title>

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/animations.css">
    <link rel="stylesheet" type="text/css" href="css/header.css">
    <link rel="stylesheet" type="text/css" href="css/mainmenu.css">

    <link rel="stylesheet" type="text/css" href="css/prolog-module.css">

    <!--JQuery-->
    <script src="lib/jquery-3.4.1.min.js"></script>

    <script src="lib/tau-prolog.js"></script>

    <script src="js/prolog/prolog-helper.js"></script>
    <script src="js/prolog/main.js"></script>
</head>
<body>
    <header><button onclick="window.location = 'index.php'">Back</button></header>

    <div id="container">
        <div id="prolog-names">
            <h1>Facts and rules</h1>
            <div id="data-container">
                <h3>Facts in the Knoweledge Base</h3>
                <div id="prolog-data">
                </div>

                <h3>Rules in the Knoweledge Base</h3>
                <textarea id = "prolog-db" <?=$currentUser["is_admin"] == 1? "": "readonly"?>>
                </textarea>
                <button <?=$currentUser["is_admin"] == 1? "": "style = 'display: none'"?> class="normal-button" onclick = "saveCustomProlog()">
                Insert and save
                </button>
            </div>
        </div>

        <div id="prolog-worker">
        <h1>Check rules and facts</h1>
            <div id="prolog-input">
                <input id="prolog-command" placeholder="Insert rules here...">
                <button onclick="runPrologQueryLocal()" id = "execute">Execute</button>
            </div>

            <div id="prolog-output"> 
                <textarea id="prolog-text">
                </textarea>
            </div>
        </div>
    </div>
    <div class="flex-filler"></div>
</body>
</html>