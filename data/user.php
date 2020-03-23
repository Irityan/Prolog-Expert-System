<?php
require_once "db_connect.php";
makeConnection();

if (isset($_POST["action"])) {
    if ($_POST["action"] == "insert") {
        $newUser = json_decode($_POST["data"], true);

            $login = $newUser["login"];
            $password = $newUser["password"];
            $isAdmin = $newUser["isAdmin"];

            $sql = "INSERT INTO rat_user (login, user_password, is_admin) VALUES ('$login', '$password', $isAdmin);";
            $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            $userId = mysqli_insert_id($connect);
            echo $userId;
    } else if ($_POST["action"] == "update") {
        $editUser = json_decode($_POST["data"], true);

        $id = $editUser["id"];
        $login = $editUser["login"];
        $password = $editUser["password"];
        $isAdmin = $editUser["isAdmin"];

        $sql = "UPDATE rat_user SET login = '$login', user_password = '$password', is_admin = $isAdmin WHERE id = $id";

        $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            echo 1;
    }

} else if (isset($_GET["action"])) {
    if($_GET["action"] == "get-all") {
        $sql = "SELECT * FROM rat_user";
        $result = $connect->query($sql);

        $userList = array();

        if ($result->num_rows > 0) {
            while($userRaw = $result->fetch_assoc()) {
                $tempUser = array();
                $tempUser["id"] = $userRaw["id"];
                $tempUser["login"] = $userRaw["login"];
                $tempUser["userPassword"] = $userRaw["user_password"];
                $tempUser["isAdmin"] = $userRaw["is_admin"];

                $userList[] = $tempUser;

            }
        }

        echo json_encode($userList);
        
    } else if($_GET["action"] == "delete-by-id") {
        $userId = $_GET["id"];
        $sql = "DELETE FROM rat_user WHERE id = $userId";
        $connect->query($sql);

        if (mysqli_error($connect) == "") {
            echo 1;
        } else {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
    }

    }
}
$connect->close();
?>