<?php require_once("login.php");

if (isset($_SESSION['currentUser'])) {
    header('location: menu.php');
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Expert system building tools</title>


    <!--JQuery-->
	<script src="lib/jquery-3.4.1.min.js"></script>

    <!--JQuery alert-->
    <script src="lib/jquery-confirm/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="lib/jquery-confirm/jquery-confirm.min.css">

    <!--JQuery UI-->
    <script src="lib/jquery-ui-1.12.1/jquery-ui.min.js"></script>
	<link rel="stylesheet" href="lib/jquery-ui-1.12.1/jquery-ui.min.css">
	<link rel="stylesheet" href="css/alert.css">

    <script src="js/alert.js"></script>

    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/animations.css">
    <link rel="stylesheet" type="text/css" href="css/header.css">
    <link rel="stylesheet" type="text/css" href="css/loginPage.css">
</head>
<body>
        <header><h1>Expert system building tools</h1></header>

        <?php display_error();?>

        <div class="flex-filler"></div>

        <div id="container">
            <form method="post" action="index.php">
                <div>
                    <label for="login">Username</label>
                    <input required id="login" type="text" name="login">
                </div>

                <div>
                    <label for="password">Password</label>
                    <input required id="password" type="password" name="password">
                </div>

                <div>
                    <button type="submit" class="normal-button" name="login-button">Log in</button>
                </div>
            </form>
        </div>

        <div class="flex-filler"></div>
</body>
</html>