function setReportTable() {
    //console.log("Таблица шаблона:");
    //console.log(reportTemplateArray);

    let tempItem = null;
    for(i in reportTemplateArray) {
        tempItem = "";

        itemName = reportTemplateArray[i]["name"];
        itemType = reportTemplateArray[i]["type"];
        prologName = reportTemplateArray[i]["prologName"];

        switch(itemType) {
            case "string":
            case "stringList":
            case "number":
            case "date":
                tempItem = `<tr><td>${itemName}</td><td>${prologName}</td><td>${itemTypes[itemType]}</td></tr>`;
                break;
            case "tableFixed":
            case "tableFree":
                let tempTable = $("<table class='embedded-table'></table>");
                let tableData = reportTemplateArray[i]["tableData"];
                if (itemType == "tableFixed") {
                    let tempRow = $("<tr></tr>");
                    for (var j in tableData[0]) {
                        $(tempRow).append(`<td>${tableData[0][j]}</td>`);
                    }
                    $(tempTable).append(tempRow);
                    for (var k in tableData[1]) {
                        tempRow = $(`<tr><td>${tableData[1][k]}</td></tr>`);
                        $(tempTable).append(tempRow);
                    }
                    $($(tempTable).find("tr")[1]).append(`<td class="temp-data" colspan = '${tableData[0].length - 1}' rowspan = '${tableData[1].length}'>Данные</td>`);
                } else {
                    let tempRow = $("<tr></tr>");
                    for (var j in tableData) {
                        $(tempRow).append(`<td>${tableData[j]}</td>`);
                    }
                    $(tempTable).append(tempRow);
                    $(tempTable).append(`<tr><td class="temp-data" colspan="${tableData.length}">Данные</td></tr>`);
                }
                //console.log(tempTable);
                tempItem = `<tr><td>${itemName}</td><td>${prologName}</td><td>${itemTypes[itemType]}</td></tr><tr><td colspan="3">${$(tempTable)[0].outerHTML}</td></tr>`;
                break;
            case "aggr":
                let prologRule = reportTemplateArray[i]["prologRule"];
                tempItem = `<tr><td>${itemName}</td><td>${prologName}</td><td>${itemTypes[itemType]}</td></tr><tr><td colspan="3">${prologRule}</td></tr>`;
                break;
            default:
                tempItem = `<tr><td>${itemName}</td><td>${prologName}</td><td style="color:gray"><i>Неизвестный тип</i></td></tr>`;
                break;
        }
        $("#table-data").append(tempItem);
    } 
}

function getTemplate(id) {
    //console.log("Попытка выполнения операции SELECT...");
    $.ajax({
        url:"data/reportTemplate.php",
        method:"GET",
        data:{"action":"get-by-id", "id":id},
        success: function(jsondata) {
            //console.log("id: " + id);
            let data = JSON.parse(jsondata);

            let templateName = data["template_name"];
            let templateBody = data["template_body"];

            $("#template-name-span").html(templateName);
            reportTemplateArray = new ReportTemplateArray();

            for(var i in templateBody) {
                let tempItem = templateBody[i];
                let itemId = tempItem["id"];
                let order = tempItem["item_order"];
                let itemName = tempItem["element_name"];
                let itemType = tempItem["element_type"];
                let prologName = tempItem["prolog_name"];

                let newItem = null;
                switch(itemType) {
                    case "tableFree":
                    case "tableFixed":
                        newItem = new TemplateItemTable(itemId, itemName, itemType, prologName, JSON.parse(tempItem["data"]));
                        break;
                    case "aggr":
                        newItem = new TemplateItemProlog(itemId, itemName, itemType, prologName, tempItem["data"]);
                        break;
                    default:
                        newItem = new TemplateItem(itemId, itemName, itemType, prologName);
                        break;
                }

                reportTemplateArray[order] = newItem;
            }

            setReportTable();
        },
        error: function(request, status, thrown) {
            alertError("Ошибка при получении шаблона", "Не удалось получить шаблон из БД.");
            window.location = "menu.php";
        }
    });
}

function deleteWarning() {
    //console.log("Пытаюсь удалить шаблон...");
    confirm("Удалить?", "Вы действительно хотите удалить данный шаблон?").then(function(answer) {
        if (answer) {
            //console.log("Удаление подтверждено");
            $.ajax({
                url:"data/reportTemplate.php",
                method:"GET",
                data:{"action":"delete-by-id", "id":templateId},
                success: function(data) {
                    //console.log("Успешно выполнен запрос DELETE BY ID");
                    //console.log(data);

                    sessionStorage.setItem("currentTemplateId", -1);

                    window.location.replace("index.php");
                },
                error: function(request, status, error) {
                    
                }
            });
        } else {
            //console.log("Удаление отменено");
        }
        
    });
}

$(function() {

    itemTypes = {
        "string" : "Строка",
    "stringList" : "Список строк",
        "number" : "Число",
    "tableFixed" : "Таблица (фикс.)",
     "tableFree" : "Таблица (произв.)",
          "aggr" : "Пролог-агрегатор",
           "date": "Дата"
    };

    //console.log("Открыт просмотр шаблона");
    templateId = $("#template-id").val();
    reportTemplateArray = null;

    getTemplate(templateId);    
});