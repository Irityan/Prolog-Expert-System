<?php
require_once "db_connect.php";
makeConnection();

    if (isset($_POST["action"])) {
        if($_POST["action"] == "insert") {
            $data = json_decode($_POST["data"], true);

            $templateName = e($data["templateName"]);
            $templateBody = $data["templateBody"];

            $sql = "INSERT INTO report_template (template_name) VALUES ('{$templateName}');";
            $templateId = null;
            if ($connect->query($sql) == TRUE) {
                if (mysqli_error ($connect) == "") {
                    /*echo mysqli_insert_id($connect);
                    exit();*/
                    $templateId = mysqli_insert_id($connect);
                }
            }

            if (!$templateId) {
                echo mysqli_error ($connect);
                $connect->close();
                exit();
            }

            foreach($templateBody as $index => $templateItem) {
                $itemOrder = $index;
                $itemName = $templateItem["name"];
                $itemType = $templateItem["type"];
                $prologName = $templateItem["prologName"];

                $itemData = "";
                if ($itemType == "tableFixed" || $itemType == "tableFree") {
                    $itemData = json_encode ($templateItem["tableData"], JSON_UNESCAPED_UNICODE);
                } else if ($itemType == "aggr") {
                    $itemData = e($templateItem["prologRule"]);
                }

                $sql = "INSERT INTO template_element (item_order, element_name, element_type, prolog_name, data, template_id) VALUES ($itemOrder, '$itemName', '$itemType', '$prologName', '$itemData', $templateId);";
                $connect->query($sql);
                

                if (mysqli_error ($connect) == "") {
                    $sql = "INSERT INTO template_prolog (template_id) VALUES ($templateId)";
                    $connect->query($sql);
                }

                if (mysqli_error($connect)) {
                    echo mysqli_error ($connect);
                    $connect->close();
                    header('HTTP/1.1 500 Ошибка');
                }

            }

            echo $templateId;
        } else if ($_POST["action"] == "update") {
            $data = json_decode($_POST["data"], true);

            $templateId = $data["templateId"];
            $templateName = $data["templateName"];
            $templateBody = $data["templateBody"];

            $sql = "UPDATE report_template SET template_name = '$templateName' WHERE id = $templateId";
            $connect->query($sql);

            if (mysqli_error($connect) != "") {
                echo mysqli_error ($connect);
                $connect->close();
                header('HTTP/1.1 500 Ошибка');
            }

            $connect->query("DELETE FROM template_element WHERE template_id = $templateId");

            foreach($templateBody as $index => $templateItem) {
                $itemOrder = $index;
                $elementName = $templateItem["name"];
                $itemType = $templateItem["type"];
                $prologName = $templateItem["prologName"];
                
                $itemData = "";
                if ($itemType == "tableFixed" || $itemType == "tableFree") {
                    $itemData = json_encode ($templateItem["tableData"], JSON_UNESCAPED_UNICODE);
                } else if ($itemType == "aggr") {
                    $itemData = e($templateItem["prologRule"]);
                }

                $sql = "INSERT INTO template_element (item_order, element_name, element_type, prolog_name, data, template_id) VALUES ($itemOrder, '$elementName', '$itemType', '$prologName', '$itemData', $templateId)";
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
        $templateId = $_GET['id'];
        $sql = "SELECT template_name FROM report_template WHERE id = $templateId LIMIT 1;";
        $result = $connect->query($sql);
       

        if($result->num_rows > 0) {
            $templateName = $result->fetch_assoc()["template_name"];
		} else {
            echo "{}";
            $connect->close();
            exit();
        }
        
        $sql = "SELECT * FROM template_element WHERE template_id = $templateId";
        $result = $connect->query($sql);

        $templateBody = array();

        if($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $templateBody[] = $row;
            }
        }

        $response = array("template_name" => $templateName,
                          "template_body" => $templateBody);
        
        echo json_encode($response);
        } else if($_GET["action"] == "get-all") {
            $sql = "SELECT * FROM report_template";
            $result = $connect->query($sql);

            $templateList = array();

            if ($result->num_rows > 0) {
                while($template_raw = $result->fetch_assoc()) {
                    $tempTemplate = array();
                    $tempTemplate["id"] = $template_raw["id"];
                    $tempTemplate["template_name"] = $template_raw["template_name"];

                $sql = "SELECT * FROM template_element WHERE template_id = {$tempTemplate['id']}";
                $result2 = $connect->query($sql);

                $templateBody = array();
                if ($result2->num_rows > 0) {
                    while($row = $result2->fetch_assoc()) {
                        $templateBody[] = $row;
                    }
                }

                $tempTemplate["template_body"] = $templateBody;

                $templateList[] = $tempTemplate;

                }
            }

            echo json_encode($templateList);
            
        } else if ($_GET["action"] == "get-by-user-id") {

            $userId = $_GET["id"];

            $sql = "SELECT * FROM report_template INNER JOIN user_template_usage ON report_template.id = user_template_usage.template_id WHERE user_id = $userId";

            $result = $connect->query($sql);

            $templateList = array();

            if ($result->num_rows > 0) {
                while($template_raw = $result->fetch_assoc()) {
                    $tempTemplate = array();
                    $tempTemplate["id"] = $template_raw["template_id"];
                    $tempTemplate["template_name"] = $template_raw["template_name"];

                $sql = "SELECT * FROM template_element WHERE template_id = {$tempTemplate['id']}";
                $result2 = $connect->query($sql);

                $templateBody = array();
                if ($result2->num_rows > 0) {
                    while($row = $result2->fetch_assoc()) {
                        $templateBody[] = $row;
                    }
                }

                $tempTemplate["template_body"] = $templateBody;

                $templateList[] = $tempTemplate;

                }
            }

            echo json_encode($templateList);
            
        } else if($_GET["action"] == "delete-by-id") {
            $templateId = $_GET["id"];
            $sql = "DELETE FROM report_template WHERE id = $templateId";
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