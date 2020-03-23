<?php
require_once "db_connect.php";
makeConnection();

if (isset($_POST["action"])) {
    if ($_POST["action"] == "insert") {
        $newUsage = json_decode($_POST["data"], true);

            $userId = $newUsage["userId"];
            $templateId = $newUsage["templateId"];

            $sql = "INSERT INTO user_template_usage (user_id, template_id) VALUES ($userId, $templateId);";
            $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            $usageId = mysqli_insert_id($connect);
            echo $usageId;
    }
} else if (isset($_GET["action"])) {

    if ($_GET["action"] == "get-by-user-id") {

        $userId = $_GET["id"];

        $sql = "SELECT * FROM user_template_usage WHERE user_id = $userId";
        $result = $connect->query($sql);

        $usageList = array();

        if ($result->num_rows > 0) {
            while($usageRaw = $result->fetch_assoc()) {
                $tempUsage = array();
                $tempUsage["userId"] = $usageRaw["user_id"];
                $tempUsage["templateId"] = $usageRaw["template_id"];

                $usageList[] = $tempUsage;

            }
        }

        echo json_encode($usageList);

    } else if ($_GET["action"] == "delete-by-user-id") {
        $userId = $_GET["id"];

        $sql = "DELETE FROM user_template_usage WHERE user_id = $userId";
        $connect->query($sql);

        if (mysqli_error($connect) == "") {
            echo mysqli_affected_rows($connect);
        } else {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
    }

    }
}
?>