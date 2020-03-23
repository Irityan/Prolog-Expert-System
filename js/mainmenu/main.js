function logout() {
    //console.log("Выхожу из приложения...");
    sessionStorage.clear();
    window.location = 'menu.php?logout';
}

function changeButtonsAccessibility () {
    let currentTemplateId = $("#currentTemplate").val();

    let templateIsSet = (currentTemplateId >= 0);
    $("#open-template-button, #table-button, #prolog-button").attr("disabled", !templateIsSet);
}

function getTemplates() {
    $("#currentTemplate").html('<option value="-1">Без шаблона</option>');

    let userId = $("#user-id").val();
    let isAdmin = $("#is-admin").val();

    let requestData = isAdmin == 1? {"action" : "get-all"} : {"action": "get-by-user-id", "id" : userId};

    $.ajax({
        url:"data/reportTemplate.php",
        method: "GET",
        data: requestData,
        success: function(data) {
            //console.log("tempList", data);
            let tempList = JSON.parse(data);
            templatesArray = [];
            for(var i in tempList) {
                let tempTemplate = {};
                tempTemplate["id"] = tempList[i]["id"];
                tempTemplate["templateName"] = tempList[i]["template_name"];

                let rawItemList = tempList[i]["template_body"];
                let tempItemList = new ReportTemplateArray();

                for (j in rawItemList) {
                    let tempItem = {};
                    tempItem["id"] = rawItemList[j]["id"];
                    tempItem["itemOrder"] = rawItemList[j]["item_order"];
                    tempItem["data"] = rawItemList[j]["data"];
                    tempItem["elementName"] = rawItemList[j]["element_name"];
                    tempItem["elementType"] = rawItemList[j]["element_type"];
                    tempItem["prologName"] = rawItemList[j]["prolog_name"];

                    resultItem = null;

                    switch(tempItem["elementType"]) {
                        case "tableFixed":
                        case "tableFree":
                            resultItem = new TemplateItem(tempItem["id"], tempItem["elementName"], tempItem["elementType"], tempItem["prologName"], JSON.parse(tempItem["data"]));
                            break;
                        case "aggr":
                            resultItem = new TemplateItemProlog(tempItem["id"], tempItem["elementName"], tempItem["elementType"], tempItem["prologName"], tempItem["data"]);
                            break;
                        default:
                            resultItem = new TemplateItem(tempItem["id"], tempItem["elementName"], tempItem["elementType"], tempItem["prologName"]);
                            break;
                    }

                    tempItemList.push(resultItem);
                }

                tempTemplate["templateBody"] = tempItemList;

                templatesArray.push(tempTemplate);
            }

            //console.log("templatesArray", templatesArray);

            sessionStorage.setItem("templatesArray", JSON.stringify(templatesArray));

            for (i in templatesArray) {
                $("#currentTemplate").append(`<option value="${i}">${templatesArray[i]['templateName']}</option>`);
            }

            let currentTemplateId = sessionStorage.getItem("currentTemplateId");
            
            if (currentTemplateId) {
                $("#currentTemplate").val(currentTemplateId).change();
                //console.log($("#currentTemplate").val());
            } else {
                sessionStorage.setItem("currentTemplateId", -1);
            }

            //console.log("Хранящийся в сессии id шаблона: " + sessionStorage.getItem("currentTemplateId"));

            changeButtonsAccessibility();
        },
        error: function(request, status, error) {
            alertError("Ошибка!", "Ошибка при получении списка шаблонов.");
        }
    });
}

function openTemplateViewer() {
    let templateId = sessionStorage.getItem("currentTemplateId");
    if (templateId && templateId >= 0) {
        window.location = `report-template-view.php?id=${templatesArray[templateId]["id"]}`;
    }
}

$(function() {
    $("#currentTemplate").change(function() {
        sessionStorage.setItem("currentTemplateId", $("#currentTemplate").val());
        let id = sessionStorage.getItem("currentTemplateId");
        let array = JSON.parse(sessionStorage.getItem("templatesArray"));

        /*//console.log("id");
        //console.log(id);
        //console.log(array);
        //console.log("Текущий шаблон:");*/
        if (id >= 0) {
            ////console.log(array[id]);
        } else {
            ////console.log(null);
        }


        changeButtonsAccessibility();
    });

    getTemplates();

});