function initTypeSelect() {
    itemTypes = {
                "string" : "Строка",
            "stringList" : "Список строк",
                "number" : "Число",
            "tableFixed" : "Таблица (фикс.)",
             /*"tableFree" : "Таблица (произв.)",*/
                   "date":"Дата",
                  "aggr" : "Пролог-агрегатор"
        };
        
    //$("#new-item-type").empty();
    for (var key in itemTypes) {
        $("#new-item-type").append(`<option value = '${key}'>${itemTypes[key]}</option>`);
    }
}

function addNewItem() {
    //console.log("Пытаюсь добавить новую строку к шаблону...");

    //Получение и проверка имени элемента
    var tempName = $("#new-item-name").val().trim();

    if (tempName == "") {
        //console.log("Поле с названием было оставлено пустым!");
        alertError("Название элемента не может быть пустым","Пожалуйста, введите название для нового элемента.");
        return;
    }

    
    if (reportTemplateArray.isNameUsed(tempName)) {
        //console.log("Данное имя уже занято.");
        alertError("Данное имя уже занято.", "Пожалуйста, выберите другое имя для нового элемента.");
        return;
    }


    //Получение и проверка prolog-имени факта от данного элемента
    var prologName = $("#new-item-prolog-name").val().trim();

    if (prologName == "") {
        //console.log("Поле с фактом пролога было оставлено пустым!");
        alertError("Название факта Prolog не может быть пустым", "Пожалуйста, введите имя для факта Prolog данного элемента");
        return;
    }

    if (!PrologHelper.isValidPredicatName(prologName)) {
        //console.log("Правило с фактом пролога не соответствует нотации!");
        alertError("Неверное название факта Prolog", "Пожалуйста, введите корректное имя для факта Prolog.");
        return;
    }

    if (prologName == "reportName" || reportTemplateArray.isPrologNameUsed(prologName)) {
        //console.log("Данное имя факта Prolog уже занято.");
        alertError("Данное имя факта Prolog уже занято.", "Пожалуйста, выберите другое имя факта Prolog.");
        return;
    }

    let itemType =  $("#new-item-type").val();

    let tempItem = null;

    switch(itemType) {
        case "string":
        case "stringList":
        case "number":
        case "date":
                tempItem = new TemplateItem(-1, tempName, itemType, prologName);
                break;

        case "tableFixed":
            tempItem = new TemplateItemTable(-1, tempName, itemType, prologName, [["",""],[""]]);
            //console.log(TemplateTable.createTableFromItem(tempItem));
            break;

        case "tableFree":
            tempItem = new TemplateItemTable(-1, tempName, itemType, prologName, [""]);
            break;

        case "aggr":
            tempItem = new TemplateItemProlog(-1, tempName, itemType, prologName, "");
            break;

        default:
            tempItem = null;
            break;

    }

    //console.log("Новая строка: ", tempItem);
    
    reportTemplateArray.push(tempItem);
    TemplateTable.addItemToTable(tempItem);

    $("#new-item-name, #new-item-prolog-name").val('');
    
    
    //console.log("Текущий вид шаблона: ", reportTemplateArray);
}

function deleteConfirm(itemId) {
    //console.log("Пытаюсь удалить элемент...");
    confirm("Удаление элемента", `Вы действительно хотите удалить элемент "${reportTemplateArray[itemId].name}"?`).then(function(answer) {
        if (answer) {
            //console.log("Получено подтверждение");
            deleteItem(itemId);

        } else {
            //console.log("Удаление отменено");
        }
    });
}

function deleteItem(itemId) {
    let itemToDelete = reportTemplateArray[itemId];
    reportTemplateArray.splice(itemId, 1);
    TemplateTable.removeItem(itemId);

    //console.log("Текущий вид шаблона: ", reportTemplateArray);
}

function resetData() {
    
    $("input").val("");

    templateId = -1;
    templateName = "";
    reportTemplateArray = new ReportTemplateArray();
}

function getTemplate(id) {
    //console.log("Попытка выполнения операции SELECT...");
    $.ajax({
        url:"data/reportTemplate.php",
        method:"GET",
        data:{"action":"get-by-id", "id":id},
        success: function(jsondata) {
            let data = JSON.parse(jsondata);

            templateName = data["template_name"];
            let templateBody = data["template_body"];

            $("#template-name").val(templateName);
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

            TemplateTable.initTable(reportTemplateArray);
        },
        error: function(request, status, thrown) {
            alertError("Ошибка при получении шаблона", "Не удалось получить шаблон из БД.");
            resetData();
        }
    });
}

function insertTemplate() {
    //console.log("Попытка выполнения операции INSERT...");

    let templateName = $("#template-name").val().trim();

    if (templateName == "") {
        alertError("Ошибка при сохранении","Название не может быть пустым");
        return;
    }

    //console.log(JSON.stringify(reportTemplateArray));

    $.ajax({
        url: "data/reportTemplate.php",
        method: "POST",
        data: {"action":"insert", "data":JSON.stringify({"templateName":templateName, "templateBody":reportTemplateArray})},
        success: function(data) {
            //console.log("Шаблон успешно добавлен");
            //console.log(data);
            window.location = `report-template-editor.php?id=${data}`;
        },

        error: function(request, status, error) {
            console.log("Ошибка при добавлении шаблона");
        }
    });
}

function tryUpdate() {
    //console.log("Попытка выполнения операции UPDATE...");

    templateName = $("#template-name").val().trim();

    if (templateName == "") {
        alertError("Ошибка при сохранении","Название не может быть пустым");
        return;
    }

    //Проверка наличия отчётов
    $.ajax({
        url:"data/report.php",
        method: "GET",
        data: {"action":"get-by-template-id", "id":templateId},
        success: function(data) {
            let reports = JSON.parse(data);
            if (reports.length == 0) {
                console.log("Отчётов для заданного шаблона не найдено");
                updateTemplate();
            } else {
                //console.log("Для данного шаблона существуют отчёты");

                $.confirm({
                    title: "Существующие отчёты",
                    content: "Для данного шаблоны уже существуют отчёты. Учитывая это, какое действие следует предпринять?",
                    useBootstrap: false,
                    boxWidth: "300px",
                    animation: "zoom",
                    animateFromElement: false,
                    theme: "dark",
                    type: "orange",
            
                    buttons: {
                        deleteAll: {
                            text:"Удалить отчёты",
                            btnClass:"btn-red",
                            action: function() {
                                updateTemplate();
                                $.ajax({
                                    url:"data/report.php",
                                    method:"GET",
                                    data:{"action":"delete-by-template-id", "id":templateId},
                                    success: function(data) {
                                        //console.log("Успешно выполнен запрос DELETE BY TEMPLATE ID");
                                        //console.log(data);
                                    },
                                    error: function(request, status, error) {
                                        
                                    }
                                });
                            }
                        },

                        saveNew : {
                            text:"Дублировать шаблон",
                            btnClass:"btn-green",
                            action: function() {
                                insertTemplate();
                            }
                        },
                        /*confirm: {
                            text: "Всё равно сохранить",
                            btnClass:"btn-blue",
                            keys: ['enter'],
                            action: function () {
                                updateTemplate();
                                for(i in reports) {
                                    for(j in reports[i]["report_body"]) {
                                        let elementValue = reports[i]["report_body"][j]["element_value"];
                                        let templateElementId = reports[i]["report_body"][j]["template_element_id"];
                                        let reportId = reports[i]["report_body"][j]["report_id"];

                                        let found = false;
                                        for(k in reportTemplateArray) {
                                            if (reportTemplateArray[k]["id"] == templateElementId) {
                                                found = true;
                                                break;
                                            }
                                        }

                                        if (!found) {
                                            continue;
                                        }
                                        
                                        $.ajax({
                                            url:"data/reportElement.php",
                                            method:"POST",
                                            data:{"action":"insert", "data":JSON.stringify({"elementValue":elementValue, "templateElementId":templateElementId, "reportId":reportId})},
                                            success: function(data) {
                                                //console.log("Восстановление элементов отчётов успешно проведено");
                                                //console.log(data);
                                            },
                                            error: function(a,b,c) {
                                                //console.log(a);
                                                //console.log(b);
                                                //console.log(c);
                                            }
                                        });
                                    }
                                }
                            }
                        },*/

                        cancel: {
                            text:"Отмена",
                            btnClass:"btn-blue",
                            action: function() {
                                //console.log("Сохранение отменено");
                            }
                        }
                    },

                    escapeKey:"cancel"
                    }
                );
            }
        }
    });
}

function updateTemplate() {
    $.ajax({
        url:"data/reportTemplate.php",
        method:"POST",
        data:{"action":"update","data":JSON.stringify({"templateId": templateId, "templateName":templateName, "templateBody": reportTemplateArray})},
        success: function(data) {
            //console.log("Шаблон успешно обновлён");
            //console.log(data);

            $("#container").fadeOut(200).fadeIn(200);
        },
        error: function(a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
        }
    });
}

//Начало работы
$(function() {
    templateId = $("#templateId").val();
    reportTemplateArray = null;

    initTypeSelect();


    if (templateId > 0) {
        getTemplate(templateId);        
    } else {
        resetData();
        TemplateTable.initTable(reportTemplateArray);
    }
});