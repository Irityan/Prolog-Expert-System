var stopPlease = false;

function loadProlog() {

    let defer = $.Deferred();
    let reportsImported = $.Deferred();

    let templates = JSON.parse(sessionStorage.getItem("templatesArray"));
    //console.log("templates", templates);
    let templateId = sessionStorage.getItem("currentTemplateId");

    template = templates[templateId];

    prologCommands = PrologHelper.getCommandsFromTemplate(template);
    //console.log(prologCommands);

    prologReportData = "";
    prologPredicatData = "";

    $.ajax({
        url:"data/report.php",
        method:"GET",
        data: {"action": "get-by-template-id","id": template["id"]},
        success: function(data) {
            //console.log("Успешно выполнен запрос GET BY TEMPLATE ID!");
            let reports = JSON.parse(data);

            for(i in template["templateBody"]) {
                element = template["templateBody"][i];
                if (element["type"] == "aggr") {
                    prologPredicatData += `${element["prologName"]}(Id, Answer) :- ${element["prologRule"]}`;
                    if (prologPredicatData.slice(-1) != '.') {
                        prologPredicatData += '.';
                    }
                    prologPredicatData += '\n';
                }
            }

            for(i in reports) {

                prologReportData += `reportName(${reports[i]["id"]}, '${reports[i]["report_name"]}').\n`;

                let reportBody = reports[i]["report_body"];
                for (j in reportBody) {
                    let templateItem = template["templateBody"].find(x => x["id"] == reportBody[j]["template_element_id"]);
                    if (templateItem["type"] == "aggr") {
                        continue;
                    }
                    /*if (templateItem["type"] == "aggr") {
                        prologReportData+=`${templateItem["prologName"]}(Id, Answer) :- ${templateItem["prologRule"]}`;
                        if (prologReportData.slice(-1) != '.') {
                            prologReportData += '.';
                        }
                        prologReportData += '\n';

                    } else */else if (templateItem["type"] == "number") {
                        prologReportData+=`${templateItem["prologName"]}(${reports[i]["id"]}, ${reportBody[j]["element_value"]}).\n`;
                    } else if (templateItem["type"] == "tableFixed") {
                        prologReportData+=`${templateItem["prologName"]}(${reports[i]["id"]}, ${reportBody[j]["element_value"]}).\n`;
                        //prologReportData+=`${templateItem["prologName"]}(${reports[i]["id"]}, [['математика']]).\n`;
                    }
                     else {
                        //prologReportData+=`${templateItem["prologName"]}(Id, Answer) :- ${templateItem["prologName"]}(${reports[i]["id"]}, ${reportBody[j]["element_value"]}).\n`;
                        prologReportData+=`${templateItem["prologName"]}(${reports[i]["id"]}, '${reportBody[j]["element_value"]}').\n`;
                    }   
                }
            }

            //console.log(prologReportData);

            reportsImported.resolve(true);
        },
        error: function(request, status, error) {
            reportsImported.resolve(false);
        }
    });

    prologCustomData = "";

    reportsImported.then(function() {

        session = pl.create();

        $.ajax({ 
            url:"data/templateProlog.php",
            method:"GET",
            data: {"action": "get-by-template-id" ,"id": template["id"]},
            success: function(data) {
                //console.log("prolog data", data);
                prologCustomData = data;
                defer.resolve(true);
                
                prologLibs = ":- use_module(library(lists)).\n" + 
                             ":- set_prolog_flag(double_quotes,atom).\n";
                prologAllData = prologLibs + prologReportData + prologPredicatData + prologCustomData;
                //console.log(prologAllData);
                session.consult(prologAllData);
            },
            error: function() {
                defer.resolve(false);
            
                session.consult(prologReportData);
            }
        });

    });

    return defer.promise();
}

function initEditor() {
    $("#prolog-data").html("");
    for(var i in prologCommands) {
        $("#prolog-data").append(`<div>${prologCommands[i]};</div>`);
    }

    $("#prolog-db").val(prologCustomData);
}

function runPrologQueryLocal() {
    let query = $("#prolog-command").val();

    session.query(query);

    $("#prolog-text").val("");

    stopPlease = false;
    while (!stopPlease) {
        session.answer(outputProlog);
    }

    //session.answers(outputProlog, 5);

}

function runPrologQuery(query) {

    session.query(query);
    $("#prolog-text").val("");
    session.answer(outputProlog);
}

function outputProlog(text) {
    //console.log(pl.format_answer(text));
    $("#prolog-text").val($("#prolog-text").val() + pl.format_answer(text) + "\n");
    //console.log(text);
    if ((text == false) || (text ==null)) {
        //$("#prolog-text").val("");
        stopPlease = true;
    }

    //console.log("stopPlease = " + stopPlease);
}

function saveCustomProlog() {
    let customData = $("#prolog-db").val();
    //console.log("custom data", customData);

    $.ajax({
        url:"data/templateProlog.php",
        method:"POST",
        data: {"action": "update-by-template-id" ,"data": JSON.stringify({"templateId" : template["id"], "data" : customData})},
        success: function(data) {
            //console.log("affected rows", data);
            
            $("#container").fadeOut(200).fadeIn(200);

            loadProlog().then(initEditor); 
        },
        error: function(a, b, c) {
            //console.log(a, b, c);
        }     
    });
}

$(function() {
    loadProlog().then(initEditor); 
});