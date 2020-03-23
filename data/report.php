<?php
require_once "db_connect.php";
makeConnection();

if (isset($_POST["action"])) {
    if ($_POST["action"] == "insert") {
        $data = json_decode($_POST["data"], true);
        $reportName = $data["reportName"];
        $templateId = $data["templateId"];
        $reportBody = $data["reportBody"];

        $sql = "INSERT INTO report (report_name, template_id) VALUES ('$reportName', $templateId);";

        $reportId = null;

        if ($connect->query($sql) == TRUE) {
            if (mysqli_error ($connect) == "") {
                $reportId = mysqli_insert_id($connect);
            }
        }

        if (!$reportId) {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
        }

        foreach($reportBody as $index => $templateItem) {
            $elementValue = $templateItem["value"];
            $templateElementId = $templateItem["templateElementId"];

            $sql = "INSERT INTO report_element (element_value, template_element_id, report_id) VALUES ('$elementValue', $templateElementId, $reportId);";

            if ($connect->query($sql) == TRUE) {
                if (mysqli_error ($connect) == "") {
                } else {
                    echo mysqli_error ($connect);
                    $connect->close();
                    header('HTTP/1.1 500 Ошибка');
                }
            } else {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }
        }

        echo $reportId;

    } else if ($_POST["action"] == "update") {
        $data = json_decode($_POST["data"], true);

        $reportId = $data["reportId"];
        $reportName = $data["reportName"];
        $reportBody = $data["reportBody"];

        $sql = "UPDATE report SET report_name = '$reportName' WHERE id = $reportId";
        $connect->query($sql);

        if (mysqli_error($connect) != "") {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
        }

        $connect->query("DELETE FROM report_element WHERE report_id = $reportId");

        foreach($reportBody as $index => $templateItem) {
            $elementValue  = $templateItem["value"];
            $templateElementId = $templateItem["templateElementId"];

            $sql = "INSERT INTO report_element (element_value, template_element_id, report_id) VALUES ('$elementValue', $templateElementId, $reportId)";
            $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }
        }

        echo 1;
    }

} else if (isset($_GET["action"])) {
    if ($_GET["action"] == "get-by-id") {
        $reportId = $_GET['id'];
        $sql = "SELECT * FROM report WHERE id = $reportId LIMIT 1;";
        $result = $connect->query($sql);

        if($result->num_rows > 0) {
            $report = $result->fetch_assoc();
            $reportName = $report["report_name"];
            $templateId = $report["template_id"];
		} else {
            echo "{}";
            $connect->close();
            exit();
        }
        
        $sql = "SELECT * FROM report_element WHERE report_id = $reportId";
        $result = $connect->query($sql);

        $reportBody = array();

        if($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $reportBody[] = $row;
            }
        }

        $response = array("id" => $reportId,
                          "report_name" => $reportName,
                          "template_id" => $templateId,
                          "report_body" => $reportBody);
        
        echo json_encode($response);


    }  else if($_GET["action"] == "get-by-template-id") {
        $templateId = $_GET["id"];
        $sql = "SELECT * FROM report WHERE template_id = $templateId";
        $result = $connect->query($sql);

        $reportList = array();

        if ($result->num_rows > 0) {
            while($report_raw = $result->fetch_assoc()) {
                $tempReport = array();
                $tempReport["id"] = $report_raw["id"];
                $tempReport["report_name"] = $report_raw["report_name"];
                $tempReport["template_id"] = $report_raw["template_id"];

                $sql = "SELECT * FROM report_element WHERE report_id = {$tempReport['id']}";
                $result2 = $connect->query($sql);

                $reportBody = array();
                if ($result2->num_rows > 0) {
                    while($row = $result2->fetch_assoc()) {
                        $reportBody[] = $row;
                    }
                }

                $tempReport["report_body"] = $reportBody;

                $reportList[] = $tempReport;

            }
        }

        echo json_encode($reportList);
    }
    
    else if($_GET["action"] == "get-all") {
        $sql = "SELECT * FROM report";
        $result = $connect->query($sql);

        $reportList = array();

        if ($result->num_rows > 0) {
            while($report_raw = $result->fetch_assoc()) {
                $tempReport = array();
                $tempReport["id"] = $report_raw["id"];
                $tempReport["report_name"] = $report_raw["report_name"];
                $tempReport["template_id"] = $report_raw["template_id"];

                $sql = "SELECT * FROM report_element WHERE report_id = {$tempReport['id']}";
                $result2 = $connect->query($sql);

                $reportBody = array();
                if ($result2->num_rows > 0) {
                    while($row = $result2->fetch_assoc()) {
                        $reportBody[] = $row;
                    }
                }

                $tempReport["report_body"] = $reportBody;

                $reportList[] = $tempReport;

            }
        }

        echo json_encode($reportList);

    } else if($_GET["action"] == "delete-by-id") {
        $reportId = $_GET["id"];
        $sql = "DELETE FROM report WHERE id = $reportId";
        $connect->query($sql);

        if (mysqli_error($connect) == "") {
            echo 1;
        } else {
            echo mysqli_error ($connect);
            $connect->close();
            header('HTTP/1.1 500 Ошибка');
        }

    } else if($_GET["action"] == "delete-by-template-id") {
        $templateId = $_GET["id"];
        $sql = "DELETE FROM report WHERE template_id = $templateId";
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