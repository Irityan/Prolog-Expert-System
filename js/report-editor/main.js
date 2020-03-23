function insertReport() {
    //console.log("Пытаюсь сохранить новый отчёт...");
    
    let reportName = $("#report-name").val().trim();
    let templateId = $("#template-id").val();

    if (reportName == "") {
        alertError("Пустое имя", "Имя отчёта не может быть пустым");
        return;
    }

    let reportBody = [];

    let templateBody = currentTemplate["template_body"];

    for (var i in templateBody) {
        let itemType = templateBody[i]["element_type"];
        let templateElementId = templateBody[i]["id"];

        let elementValue = "";
        switch(itemType) {
            case "string":
            case "number":
            case "date":
                elementValue = $(`#${templateElementId}`).val().trim();
                break;
            case "stringList":
                elementValue = JSON.stringify($(`#${templateElementId}`).val().trim().split(","));
                break;
            case "tableFixed":
                let data = JSON.parse(templateBody[i]["data"]);
                elementValue = [];
                for(let y = 0; y < data[1].length; y++) {
                    elementValue.push([]);
                    for(let x = 0; x < data[0].length - 1; x++) {
                        elementValue[y].push($(`table[id=${templateElementId}] input[data-x = ${x}][data-y = ${y}]`).val());
                    }
                }

                elementValue = JSON.stringify(elementValue);
                break;
        }

        let tempReportItem = {"value":elementValue, "templateElementId":templateElementId};

        reportBody.push(tempReportItem);
    }

    let report = {"reportName":reportName, "templateId":templateId, "reportBody":reportBody};

    $.ajax({
        url: "data/report.php",
        method: "POST",
        data:{"action":"insert", "data":JSON.stringify(report)},
        success: function(data) {
            //console.log("Отчёт успешно добавлен");
            //console.log(data);

            window.location = `report-editor.php?templateid=${templateId}&id=${data}`;
        },

        error: function(request, status, error) {
            //console.log("Ошибка при добавлении отчёта");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });
}

function updateReport() {
    //console.log("Пытаюсь обновить отчёт...");

    let reportName = $("#report-name").val().trim();
    let templateId = $("#template-id").val();

    if (reportName == "") {
        alertError("Пустое имя", "Имя отчёта не может быть пустым");
        return;
    }

    let reportBody = [];

    let templateBody = currentTemplate["template_body"];

    for (var i in templateBody) {
        let itemType = templateBody[i]["element_type"];
        let templateElementId = templateBody[i]["id"];

        let elementValue = "";
        switch(itemType) {
            case "string":
            case "number":
            case "date":
                elementValue = $(`#${templateElementId}`).val().trim();
                break;
            case "stringList":
                elementValue = JSON.stringify($(`#${templateElementId}`).val().trim().split(","));
                break;
            case "tableFixed":
                let data = JSON.parse(templateBody[i]["data"]);
                elementValue = [];
                for(let y = 0; y < data[1].length; y++) {
                    elementValue.push([]);
                    for(let x = 0; x < data[0].length - 1; x++) {
                        elementValue[y].push($(`table[id=${templateElementId}] input[data-x = ${x}][data-y = ${y}]`).val());
                    }
                }

                elementValue = JSON.stringify(elementValue);
                break;
        }

        let tempReportItem = {"value":elementValue, "templateElementId":templateElementId};

        reportBody.push(tempReportItem);
    }

    let report = {"reportId": reportId,"reportName":reportName, "templateId":templateId, "reportBody":reportBody};

    $.ajax({
        url: "data/report.php",
        method: "POST",
        data:{"action":"update", "data":JSON.stringify(report)},
        success: function(data) {
            //console.log("Отчёт успешно обновлён");
            //console.log(data);

            $("#container").fadeOut(200).fadeIn(200);
        },

        error: function(request, status, error) {
            //console.log("Ошибка при обновлении отчёта");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });

}

function makeForm() {
    let templateId = $("#template-id").val();
    $.ajax({
        url:"data/reportTemplate.php",
        method:"GET",
        data: {"action": "get-by-id","id": templateId},
        success: function(data) {
            //console.log("Получен шаблон");
            currentTemplate = JSON.parse(data);
            
            if ($.isEmptyObject(currentTemplate)) {
                window.location = "index.php";
            } else {
                let templateArray = currentTemplate["template_body"];
                let fieldsArray = [];

                for(var i in templateArray) {
                    let currentField = "";

                    let elementName = templateArray[i]["element_name"];
                    let elementId = templateArray[i]["id"];
                    let itemOrder = templateArray[i]["item_order"];

                    let elementType = templateArray[i]["element_type"];

                    let tableData  = null;
                    let embeddedTable = null;

                    let tempRow = null;

                    switch(elementType) {
                        case "string":
                        case "stringList":
                            currentField = 
                            `<div class="text-input">
                                <label for="${elementId}">${elementName}:</label>
                                <input type="text" id="${elementId}" placeholder="${elementName}">
                            </div>`;
                            break;
                        case "number":
                            currentField = 
                                `<div class="text-input">
                                <label for="${elementId}">${elementName}:</label>
                                <input type="number" id="${elementId}" placeholder="${elementName}">
                            </div>`;
                            break;
                        
                        case "date":
                            currentField = 
                                `<div class="text-input">
                                <label for="${elementId}">${elementName}:</label>
                                <input type="date" id="${elementId}" placeholder="${elementName}">
                            </div>`;
                            break;

                        case "tableFixed":
                             tableData = JSON.parse(templateArray[i]["data"]);
                             embeddedTable = $(`<table id="${elementId}" class='embedded-table'></table>`);

                            tempRow = $("<tr></tr>");
                            for(var i in tableData[0]) {
                                $(tempRow).append(`<td>${tableData[0][i]}</td>`);
                            }
                            $(embeddedTable).append(tempRow);

                            for(var j in tableData[1]) {
                                tempRow = $(`<tr><td>${tableData[1][j]}</td></tr>`);

                                for(var k = 0; k < tableData[0].length - 1; k++) {
                                    $(tempRow).append(`<td><input data-x="${k}" data-y="${j}" ></td>`);
                                }

                                embeddedTable.append(tempRow);
                            }

                            currentField = embeddedTable;
                            break;
                        
                        case "tableFree":
                             tableData = JSON.parse(templateArray[i]["data"]);
                             embeddedTable = $(`<table id="${elementId}" class='embedded-table'></table>`);

                            tempRow = $("<tr></tr>");
                            for(var i in tableData[0]) {
                                $(tempRow).append(`<td>${tableData[i]}</td>`);
                            }
                            $(embeddedTable).append(tempRow);

                            tempRow = $(`<tr><td colspan=${tableData.length}><button class="add-new-button">+</button><button class="delete-button">&#10006</button></td></tr>`);
                            $(embeddedTable).append(tempRow);

                            currentField = embeddedTable;
                            break;
                        case "aggr":
                            break;
                        default:
                            currentField = `<div>неизвестный тип - ${elementType}</div>`
                            break;
                    }

                    fieldsArray[itemOrder] = currentField;
                }


                for (var i in fieldsArray) {
                    $("#container").append(fieldsArray[i]);
                }
            }

            if (reportId > 0) {
                setReport(reportId);
            }
        },
        error: function(request, status, error) {

        }
    });
}

function setReport(id) {
    $.ajax({
        url:"data/report.php",
        method:"GET",
        data: {"action": "get-by-id","id": id},
        success: function(data) {
            currentReport = JSON.parse(data);

            $("#report-name").val(currentReport["report_name"]);

            let reportBody = currentReport["report_body"];

            for(i in reportBody) {
                let templateItemId = reportBody[i]["template_element_id"]; 
                let currentTemplateItem = currentTemplate["template_body"].find(x => x["id"] == templateItemId);

                let itemType = currentTemplateItem["element_type"];

                switch(itemType) {
                    case "string":
                    case "number":
                    case "date":
                        $(`#${templateItemId}`).val(reportBody[i]["element_value"]);
                        break;
                    case "stringList":
                        //console.log("stringList", reportBody[i]["element_value"]);
                        $(`#${templateItemId}`).val(JSON.parse(reportBody[i]["element_value"]).join());
                        break;
                    case "tableFixed":
                        let data = JSON.parse(reportBody[i]["element_value"]);

                        for(let y = 0; y < data.length; y++) {
                            for(let x = 0; x < data[0].length; x++) {
                               $(`table[id=${templateItemId}] input[data-x = ${x}][data-y = ${y}]`).val(data[y][x]);
                            }
                        }
                        break;
                }
            }
        },
        error: function(request, status, error) {

        }
    });
}

function deleteWarning(id) {
    //console.log("Пытаюсь удалить отчёт...");
    confirm("Удаление элемента", `Вы действительно хотите удалить этот отчёт?`).then(function(answer) {
        if (answer) {
            //console.log("Получено подтверждение");
            deleteItem(id);

        } else {
            //console.log("Удаление отменено");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url:"data/report.php",
        method:"GET",
        data:{"action":"delete-by-id", "id":id},
        success: function(data) {
            //console.log("Успешно выполнен запрос DELETE BY ID");
            //console.log(data);

            window.location = "report-table.php";
        },
        error: function(request, status, error) {
            
        }
    });
}

$(function() {
    reportId = $("#report-id").val();
    currentTemplate = null;
    currentReport = null;
    makeForm();
});