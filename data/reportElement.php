<?php
require_once "db_connect.php";
makeConnection();

if (isset($_POST["action"])) {
    if($_POST["action"] == "insert") {
        
        $reportItem = json_decode($_POST["data"], true);

            $elementValue = $reportItem["elementValue"];
            $templateElementId = $reportItem["templateElementId"];
            $reportId = $reportItem["reportId"];

            $sql = "INSERT INTO report_element (element_value, template_element_id, report_id) VALUES ('$elementValue', $templateElementId, $reportId);";

            $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            echo $templateElementId;
    }
}

$connect->close();
?>