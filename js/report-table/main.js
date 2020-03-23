function newReport() {
    //console.log(currentTemplate);

    let templateRealId = currentTemplate["id"];

    window.location = `report-editor.php?id=-1&templateid=${templateRealId}`;
}

function editReport(id) {
    let templateRealId = currentTemplate["id"];

    window.location = `report-editor.php?id=${id}&templateid=${templateRealId}`;
}

function setTableHeader() {
    //console.log("Устанавливаю заголовок таблицы...");


    let columns = currentTemplate["templateBody"];

    //console.log("columns", columns);

    let headerRow = "<th>Название</th>";
    let filtersRow = "<th><input data-field = 'report-name'  type='text' placeholder='Название'></th>";
    //$("#reports-table thead").append("<th>Название отчёта</th>");

    $("#prolog-predicats").html("<option value='reportName'>Название отчёта</option>");
    for (var i in columns){
        let columnType = columns[i]["type"];

        $("#prolog-predicats").append(`<option value = "${columns[i]["prologName"]}">${columns[i]["name"]}</option>`);

        switch(columnType) {
            case "string":
            case "stringList":
            case "number":
            case "aggr":
            case "date":
                filtersRow += `<th> <input data-field = '${i}' placeholder = "${columns[i]['name']}"></th>`;
                headerRow += `<th>${columns[i]["name"]}</th>\n`;
                //$("#reports-table thead tr").append(`<th>${columns[i]["name"]}</th>`);
                break;
        }
    }

    $("#reports-table thead").append(`<tr>${filtersRow}</tr>\n`);
    $("#reports-table thead").append(`<tr>${headerRow}</tr>\n`);

    $("#reports-table thead input").on({
        keyup: filterTable
    });
}

function setTableData() {
    //console.log("Заполняю таблицу данными...");
    
    $.ajax({
        url:"data/report.php",
        method:"GET",
        data:{"action":"get-by-template-id", "id":currentTemplate["id"]},
        success: function(data) {
            reportsArray = JSON.parse(data);
            
            visible = new Array(reportsArray.length).fill(true);
            visibleProlog = new Array(reportsArray.length).fill(true);
            visibleFilters = new Array(reportsArray.length).fill(true);
            //console.log("visibleInit", visible);

            for(var i in reportsArray) {
                let newRow = $(`<tr onclick='editReport(${reportsArray[i]["id"]})'></tr>`);
                $(newRow).append(`<td>${reportsArray[i]["report_name"]}</td>`);

                let reportBody = reportsArray[i]["report_body"];

                for(var j in reportBody) {
                    let columnType = currentTemplate["templateBody"][j]["type"];

                    switch(columnType) {
                        case "string":
                        case "number":
                        case "date":
                            $(newRow).append(`<td>${reportBody[j]["element_value"]}</td>`);
                            break;
                        case "stringList":
                            $(newRow).append(`<td>${JSON.parse(reportBody[j]["element_value"]).join()}</td>`);
                            break;
                        case "aggr":
                                let query = currentTemplate["templateBody"].find(x => x["id"] == reportBody[j]["template_element_id"])["prologName"];
                                session.query(`${query}(${reportsArray[i]["id"]}, Answer).`);
                                session.answer(function (answer) { 
                                    //console.log(answer);
                                     if (answer != null && answer["links"] != null) {$(newRow).append(`<td>${answer["links"]["Answer"]["id"] || answer["links"]["Answer"]["value"] }</td>`);} else {$(newRow).append(`<td>Ошибка при вычислении</td>`);}
                                    });
                                //$(newRow).append(`<td>1</td>`);
                            break;
                    }
                }

                $("#reports-table tbody").append(newRow);

                
            }
        }
    });
}

function filterTable() {
    visibleFilters.fill(true);
    let filters = $("#reports-table thead input").get();
    for (var i in filters) {
        let filterValue = filters[i].value.trim().toLowerCase();


        if (filterValue != ""){
            let currentColumn = $(`#reports-table tbody tr td:nth-child(${Number(i) + 1})`).get();

            for(let j in currentColumn) {
                let tdValue = currentColumn[j].textContent.toLowerCase();
                //console.log("tdValue", tdValue);

                visibleFilters[j] = visibleFilters[j] && (tdValue.indexOf(filterValue) > - 1);
                //visible[j] = visibleProlog[j] && (visible[j] && (tdValue.indexOf(filterValue) > - 1));
                
            }
        }
    }

    //console.log("visible after sort", visible);
    
    for (var i in visible) {
        visible[i] = visibleFilters[i] && visibleProlog[i];
        $(`#reports-table tbody tr:nth-child(${Number(i) + 1})`).css("display", visible[i]?"table-row":"none");
    }
}

function filterProlog() {
    let prologCommand = $("#prolog-command").val();
    //console.log("prologCommand", prologCommand);

    session.query(prologCommand);

    visibleProlog.fill(false);

    defer = $.Deferred();

    session.answers(function (answer) {
        //console.log("answer", answer); 
        if (answer && answer["links"] && answer["links"]["Id"]) {
            visibleProlog[reportsArray.findIndex(x => x["id"] == answer["links"]["Id"]["value"])] = true;
            //$(newRow).append(`<td>${answer["links"]["Answer"]["value"]}</td>`);
        } else {
            //$(newRow).append(`<td>Ошибка при вычислении</td>`);
            //console.log("last answer");
            defer.resolve(true);
        }
    }, Number.MAX_SAFE_INTEGER);

    defer.promise().then(function(answer) {

        //console.log("AFTER");
        //console.log("visibleBefore", visible);

        for (var i in visible) {
            visible[i] = visibleFilters[i] && visibleProlog[i];
            $(`#reports-table tbody tr:nth-child(${Number(i) + 1})`).css("display", visible[i]?"table-row":"none");
        }
    });
}

function resetFilters() {
    visible.fill(true);
    visibleFilters.fill(true);
    visibleProlog.fill(true);

    $("#reports-table input").val("");

    for (var i in visible) {
        $(`#reports-table tbody tr:nth-child(${Number(i) + 1})`).css("display", "table-row");
    }
}

function addCommand() {
    //console.log("Добавляю команду к запросу...");
    let command = ` ${$("#prolog-predicats").val()}(Id, Answer)`;
    //console.log("command", command);

    $("#prolog-command").val($("#prolog-command").val() + command);
}

$(function() {

    loadProlog().then(function() {
        currentTemplateId = sessionStorage.getItem("currentTemplateId");
        let currentTemplates = JSON.parse(sessionStorage.getItem("templatesArray"));
        currentTemplate = currentTemplates[currentTemplateId];

        visible = [];
        visibleProlog = [];
        visibleFilters = [];
        reportsArray = [];

        setTableHeader();
        setTableData();
    });

});