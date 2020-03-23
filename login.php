<?php
error_reporting(E_ERROR | E_PARSE);

session_start();

require_once("settings.php");

$connect = mysqli_connect($dbPath, $dbGuestLogin, $dbGuestPassword, $dbName);

if (!$connect) {
    require_once("error.html");
    exit();
}

$errors = array();

if (isset($_POST['login-button'])) {
	login();
}

function login() {
    global $connect, $errors;

    $login = e($_POST["login"]);
    $password = e($_POST["password"]);

    if (empty($login)) {
		array_push($errors, "Требуется ввести непустой логин.");
	}
	if (empty($password)) {
		array_push($errors, "Требуется ввести непустой пароль.");
    }

    if (count($errors) == 0) {
        $query = "SELECT * FROM rat_user WHERE login='$login' AND user_password='$password' LIMIT 1";
        $result = mysqli_query($connect, $query);

        if (mysqli_num_rows($result) == 1) {
            $currentUser = mysqli_fetch_assoc($result);
            $_SESSION['currentUser'] = $currentUser;
            header('location: menu.php');
        } else {
            array_push($errors, "Неверно введён логин или пароль.");
        }
    }

    $connect->close();
}

function e($val){
	global $connect;
	return mysqli_real_escape_string($connect, trim($val));
}

function display_error() {
    global $errors;
    if (count($errors) > 0) {
        ?> 
        <script>
            $(function() {
                alertError("Ошибка!", "<?=$errors[0]?>");
            });
        </script>
        <?php
    }
}
?>