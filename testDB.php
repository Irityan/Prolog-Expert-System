<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Тесты БД</title>

    <script src="lib/jquery-3.4.1.min.js"></script>
</head>
<body>
    <h1>Тестирование работы БД (работа с консолью)</h1>
</body>
</html>

<script>

    function testReportInsert() {
        //console.log("Тестирую INSERT на report...");
        let reportArray = [{'value': 'Крутая программа', 'templateElementId':'21'},
                           {'value': JSON.stringify([['Первый', '1', 'есть'], ['Второй', '2', 'нет']]), 'templateElementId': '22'}];

        let tempData = {"action":"insert", "data":JSON.stringify({'reportName': 'Пробный отчёт', 'templateId': '20', 'reportBody':reportArray})};
        //console.log("Data:");
        //console.log(tempData);

        $.ajax({
        url: "data/report.php",
        method: "POST",
        data:tempData,
        success: function(data) {
            //console.log("Отчёт успешно добавлен");
            //console.log(data);
        },

        error: function(request, status, error) {
            //console.log("Ошибка при добавлении отчёта");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });
    }

    function testReportUpdate(id) {
        //console.log("Тестирую UPDATE на report...");
        let reportArray = [{'value': 'Офигенная программа', 'templateElementId':'21'},
                           {'value': JSON.stringify([['Первый новый', '1', 'есть'], ['Второй', '2', 'нет']]), 'templateElementId': '22'}];

        let tempData = {"action":"update", "data":JSON.stringify({'reportId': id,'reportName': 'Новый отчёт', 'templateId': '20', 'reportBody':reportArray})};
        //console.log("Data:");
        //console.log(tempData);

        $.ajax({
        url: "data/report.php",
        method: "POST",
        data:tempData,
        success: function(data) {
            //console.log("Отчёт успешно обновлён");
            //console.log(data);
        },

        error: function(request, status, error) {
            //console.log("Ошибка при обновлении отчёта");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });
    }

    function testReportGetById(id) {
        //console.log("Тестирую GET BY ID на report...");
        $.ajax({
            url:"data/report.php",
            method:"GET",
            data: {"action": "get-by-id","id": id},
            success: function(data) {
                //console.log("Успешно выполнен запрос GET BY ID!");
                //console.log(data);
                //console.log(JSON.parse(data));
            },
            error: function(request, status, error) {

            }
        });
    }

    function testReportGetByTemplateId(id) {
        //console.log("Тестирую GET BY TEMPLATE ID на report...");
        $.ajax({
            url:"data/report.php",
            method:"GET",
            data: {"action": "get-by-template-id","id": id},
            success: function(data) {
                //console.log("Успешно выполнен запрос GET BY TEMPLATE ID!");
                //console.log(data);
                //console.log(JSON.parse(data));
            },
            error: function(request, status, error) {

            }
        });
    }


    function testReportDeleteById(id) {
        //console.log("Тестирую DELETE BY ID на report...");
        $.ajax({
            url:"data/report.php",
            method:"GET",
            data:{"action":"delete-by-id", "id":id},
            success: function(data) {
                //console.log("Успешно выполнен запрос DELETE BY ID");
                //console.log(data);
            },
            error: function(request, status, error) {
                
            }
        });
    }

    function testReportDeleteByTemplateId(id) {
        //console.log("Тестирую DELETE BY TEMPLATE ID на report...");
        $.ajax({
            url:"data/report.php",
            method:"GET",
            data:{"action":"delete-by-template-id", "id":id},
            success: function(data) {
                //console.log("Успешно выполнен запрос DELETE BY TEMPLATE ID");
                //console.log(data);
            },
            error: function(request, status, error) {
                
            }
        });
    }

    function testReportGetAll() {
        //console.log("Тестирую GET ALL на report");
        $.ajax({
            url:"data/report.php",
            method:"GET",
            data:{"action":"get-all"},
            success: function(data) {
                //console.log("Успешно выполнен запрос GET ALL на report");
                //console.log(data);
                //console.log(JSON.parse(data));
            }
        });
    }

    $(function() {
    });
</script>