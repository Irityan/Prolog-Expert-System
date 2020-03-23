<?php
require_once "db_connect.php";
makeConnection();

if (isset($_POST["action"])) {
    if($_POST["action"] == "update-by-template-id") {
        $templateProlog = json_decode($_POST["data"], true);

        $templateId = $templateProlog["templateId"];
        $data =  mysqli_real_escape_string($connect, $templateProlog["data"]);


        $sql = "UPDATE template_prolog SET data = '$data' WHERE template_id = $templateId";

        $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            //echo mysqli_affected_rows($connect);
            echo $data;
    }
} else if (isset($_GET["action"])) {
    if($_GET["action"] == "get-by-template-id") {
        $templateId = $_GET["id"];

        $sql = "SELECT * FROM template_prolog WHERE template_id = $templateId LIMIT 1";
        $result = $connect->query($sql);

        if (mysqli_error($connect) != "") {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
        }

        if($result->num_rows > 0) {
            $data = $result->fetch_assoc()["data"];
            echo $data;
		} else {
            echo "";
        }

    }
}

$connect->close();
?>