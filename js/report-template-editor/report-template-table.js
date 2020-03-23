class TemplateTable {

    static recalculateIndexes() {
        //console.log("Пересчитываю индексы...");
        $(".item-row").each(function(index) {
            $(this).attr("data-id", index);
        });
    }

    static initTable(reportTemplateArray) {

        this.reportTemplateArray = reportTemplateArray;
        this.isSorting = false;

        $("#table-data").on({
            mouseenter: function () {
                if (!TemplateTable.isSorting) {
                    $(this).find(".delete-button").css('visibility','visible');
                }
            },
            mouseleave: function () {
                $(this).find(".delete-button").css('visibility','hidden');
            }
        }, ".item-row");

        $("#table-data").on({
            input: function() {
                let newName = $(this).val();

                let parentElement = this;
                while (parentElement.parentNode) {
                    parentElement = parentElement.parentNode;
                    if (parentElement.classList.contains("item-row")) {
                        break;
                    }
                }

                let itemId = parentElement.getAttribute("data-id");

                if (this.parentElement.classList.contains("column-header")) {
                    TemplateTable.reportTemplateArray[itemId].tableData[0][this.getAttribute("data-id")] = newName;
                } else if (this.parentElement.classList.contains("row-header")) {
                    TemplateTable.reportTemplateArray[itemId].tableData[1][this.getAttribute("data-id")] = newName;
                } else {
                    //console.log(this);
                    //console.log("При обновлении вложенной таблицы было выбрано неправильное текстовое поле");
                }

                ////console.log(reportTemplateArray[itemId]);
            }
        }, ".fixed-table input[type=text]");

        $("#table-data").on({
            input: function() {
                let newName = $(this).val();

                let parentElement = this;
                while (parentElement.parentNode) {
                    parentElement = parentElement.parentNode;
                    if (parentElement.classList.contains("item-row")) {
                        break;
                    }
                }

                let itemId = parentElement.getAttribute("data-id");

                if (this.parentElement.classList.contains("column-header")) {
                    TemplateTable.reportTemplateArray[itemId].tableData[this.getAttribute("data-id")] = newName;
                } else {
                    //console.log(this);
                    //console.log("При обновлении вложенной таблицы было выбрано неправильное текстовое поле");
                }

                ////console.log(reportTemplateArray[itemId]);
            }
        }, ".free-table input[type=text]");

        $("#table-data").on({
            change: function() {
                //console.log("Пытаюсь изменить правило Prolog...");
                let newRule = $(this).val().trim();

                if (newRule != "") {

                    let parentElement = this;
                    while (parentElement.parentNode) {
                        parentElement = parentElement.parentNode;
                        if (parentElement.classList.contains("item-row")) {
                            break;
                        }
                    }

                    let itemId = parentElement.getAttribute("data-id");
                    if (PrologHelper.isValidRuleDefiniton(newRule)) {
                        //console.log("Правило прошло проверку!");
                        TemplateTable.reportTemplateArray[itemId].prologRule = newRule;
                        //console.log("Новое правило:");
                        //console.log(TemplateTable.reportTemplateArray[itemId]);
                    } else {
                        //console.log("Правило не прошло проверку!");
                        alertError("Введённое правило не прошло проверку","Пожалуйста, убедитесь в том, что введённое правило не нарушает правил языка Prolog.");
                    }

                } else {
                    //console.log("Введённое правило оказалось пустым.");
                }
            }
        }, ".prolog-fact-input");

        var fixWidthHelper = function (e, ui) {

            ui.children().each(function() {
                $(this).width($(this).width());
        
            });
        

            return ui;
        
        }

        var updateTableAfterSorting = function (event, ui) {
            //console.log("Произошло изменение порядка элементов!");
                    let originalIndex = ui.item.attr('data-id'), newIndex = ui.item.index();
                    //console.log(`Перемещаю элемент с индексом ${originalIndex} в индекс ${newIndex}`);
        
                    //Изменение массива
                    reportTemplateArray.changePosition(originalIndex, newIndex);

                    //Обновление индексов
                    TemplateTable.recalculateIndexes();
        
                    //console.log("Состояние массива:");
                    //console.log(reportTemplateArray);
        }

        $("#table-data").sortable({
            cancel:".no-elements, #table-data input, #table-data button",
            helper: fixWidthHelper,
            start: function(event, ui) {
                TemplateTable.isSorting = true;
                ui.item.find(".delete-button").css('visibility','hidden');
            },
            stop: function() {
                TemplateTable.isSorting = false;
            },
            update: updateTableAfterSorting
        });

        if (reportTemplateArray.length > 0) {
            for (var i in reportTemplateArray) {
                this.addItemToTable(reportTemplateArray[i]);
            }
        } else {
            TemplateTable.setTableToEmpty();
        }
    }


    
    static clearTable() {
        $("#table-data").empty();
    }

    static setTableToEmpty() {
        $("#table-data").html("<tr><td colspan='4' class='no-elements'>Шаблон не содержит элементов</td></tr>");
    }

    static handleDelete(deleteButton) {
        let element = deleteButton;
        while(element.parentNode) {
            element = element.parentNode;
            if (element.classList.contains("item-row")) {
                break;
            }
        }

        if (element) {
            //console.log(element);
            deleteConfirm(element.getAttribute("data-id"));
        } else {
            //console.log("Кнопка удаления не находится в строке с данными!");
        }
    }

    static addItemToTable(item) {
        if ($(".item-row").length == 0) {
            //console.log("Добавляю первый элемент...");
            $("#table-data").empty();
        }

        let tempItem = ""; let itemId = reportTemplateArray.indexOf(item);
        let deleteButton = `<button data-id='${itemId}' title='Удалить строку' class='delete-button' onclick='TemplateTable.handleDelete(this)'>&#10006</button>`;
    
        switch(item.type) {
            case "string":
            case "stringList":
            case "number":
            case "date":
                tempItem = `<tr class='item-row' data-id='${itemId}'><td class='definition-column'>${item.name}</td><td>${item.prologName}</td><td>${itemTypes[item.type]}</td><td class='td-delete'>${deleteButton}</td></tr>`;
                break;
            case "tableFixed":
            case "tableFree":
                //let addColumnButton = "<button title='Добавить столбец' class='add-new-button'>&#43</button>";
                //let addRowButton = "<button title='Добавить строку' class='add-new-button'>&#43</button>";
                //let columnHeader = `<td class='column-header'><input data-id='0' type='text' placeholder='Заголовок столбца'></td>`;
                //let tempTable = `<table class='embedded-table fixed-table'><tr>${columnHeader}</tr></table>`;
                let tempTable = TemplateTable.createTableFromItem(item).outerHTML;
                tempItem = `<tr class='item-row' data-id='${itemId}'><td class="td-with-table" colspan='4'><table class="table-as-row"><tr><td>${item.name}</td><td>${item.prologName}</td><td>${itemTypes[item.type]}</td><td class="td-delete">${deleteButton}</td></tr></table>${tempTable}</td></tr>`;
                break;
            
            case "aggr":
                let infoTable = `<table class="table-as-row"><tr><td>${item.name}</td><td>${item.prologName}</td><td>${itemTypes[item.type]}</td><td class="td-delete">${deleteButton}</td></tr></table>`;
                let inputElement = `<input type="text" class="prolog-fact-input" placeholder="Правило Prolog (Вызов имеет вид: <Название>(Id, Answer), см. справку)" value="${item.prologRule}">`;
                let checkButton = `<button hidden class="normal-button">Проверить</button>`;
                tempItem = `<tr class='item-row' data-id='${itemId}'><td class="td-with-table" colspan='4'>${infoTable} <div class="prolog-fact-div">${inputElement} ${checkButton}</div></td></tr>`;
                break;

            default:
                tempItem = `<tr><td data-id='${itemId}' colspan='4' class='no-elements'>Ошибка при добавлении элемента "${item.name}".<br>Отстутствует поддержка типа ${item.type}</td></tr>`;
    
        }
        
        $("#table-data").append(tempItem);
    }

    static removeItem(itemId) {
        $(`.item-row[data-id=${itemId}]`).remove();
        TemplateTable.recalculateIndexes();

        if ($(".item-row").length == 0) {
            TemplateTable.setTableToEmpty();
        }
    }


    static redrawItemTable(id) {
        let table = TemplateTable.createTableFromItem(reportTemplateArray[id]).outerHTML;
        $(`#table-data .item-row[data-id=${id}] .embedded-table`).html(table);
    }

    static addColumnToItemTable(button) {
        //console.log("Добавляю новый столбец к элементу-таблице...");
        let parentElement = button;
        while (parentElement.parentNode) {
            parentElement = parentElement.parentNode;
            if (parentElement.classList.contains("item-row")) {
                break;
            }
        }
        let itemId = parentElement.getAttribute("data-id");
        if (reportTemplateArray[itemId].type == "tableFixed") {
            reportTemplateArray[itemId].tableData[0].push("");
        } else if (reportTemplateArray[itemId].type == "tableFree") {
            reportTemplateArray[itemId].tableData.push("");
        }

        TemplateTable.redrawItemTable(itemId);
    }

    static addRowToItemTable(button) {
        //console.log("Добавляю новую строку к элементу-таблице...");
        let parentElement = button;
        while (parentElement.parentNode) {
            parentElement = parentElement.parentNode;
            if (parentElement.classList.contains("item-row")) {
                break;
            }
        }
        let itemId = parentElement.getAttribute("data-id");
        reportTemplateArray[itemId].tableData[1].push("");
        TemplateTable.redrawItemTable(itemId);
    }

    static removeRowFromItemTable(button) {
        //console.log("Удаляю строку из элемента-таблицы...");
        let parentElement = button;
        while (parentElement.parentNode) {
            parentElement = parentElement.parentNode;
            if (parentElement.classList.contains("item-row")) {
                break;
            }
        }
        let itemId = parentElement.getAttribute("data-id");

        if (reportTemplateArray[itemId].tableData[1].length > 1) {
            reportTemplateArray[itemId].tableData[1].splice(-1, 1);
            TemplateTable.redrawItemTable(itemId);
        } else {
            //console.log("В таблице уже находится минимальное количество строк");
        }
    }

    static removeColumnFromItemTable(button) {
        //console.log("Удаляю столбец из элемента-таблицы...");
        let parentElement = button;
        while (parentElement.parentNode) {
            parentElement = parentElement.parentNode;
            if (parentElement.classList.contains("item-row")) {
                break;
            }
        }
        let itemId = parentElement.getAttribute("data-id");

        if (reportTemplateArray[itemId].type =="tableFixed") {

            if ( reportTemplateArray[itemId].tableData[0].length > 2) {
                reportTemplateArray[itemId].tableData[0].splice(-1, 1);
                TemplateTable.redrawItemTable(itemId);
            } else {
                //console.log("В таблице уже находится минимальное количество столбцов");
            }

        }   else if (reportTemplateArray[itemId].type == "tableFree") {
            
            if ( reportTemplateArray[itemId].tableData.length > 1) {
                reportTemplateArray[itemId].tableData.splice(-1, 1);
                TemplateTable.redrawItemTable(itemId);
            } else {
                //console.log("В таблице уже находится минимальное количество столбцов");
            }
        } else {
            //console.log("Тип элемента не поддерживается");
        }
    }

    static createTableFromItem(item) {
        let table = null;
        if (item.type == "tableFixed") {
            table =  $.parseHTML("<table class='embedded-table fixed-table'></table>");
            $(table).append("<tr></tr>");
            let firstRow = $(table).find("tr")[0];
            for(var column in item.tableData[0]) {
                let initValue = item.tableData[0][column].trim();
                $(firstRow).append(`<td class='column-header'><input data-id='${column}' type='text' placeholder='Столбец' value='${initValue}'></td>`);
            }

            for (var row in item.tableData[1]) {
                let initValue = item.tableData[1][row].trim();
                $(table).append(`<tr><td class='row-header'><input data-id='${row}' type='text' placeholder='Строка' value='${initValue}'></td></tr>`);
            }

            $($(table).find("tr")[1]).append(`<td class="temp-data" colspan = '${item.tableData[0].length - 1}' rowspan = '${item.tableData[1].length}'>Данные</td>`);

            let addColumnButton = `<button title="Добавить столбец" class="add-new-button" onclick="TemplateTable.addColumnToItemTable(this)">+</button>`;
            let addRowButton = `<button title="Добавить строку" class="add-new-button" onclick="TemplateTable.addRowToItemTable(this)">+</button>`;

            let removeColumnButton = `<button title="Удалить столбец" class="delete-button" onclick="TemplateTable.removeColumnFromItemTable(this)">&#10006</button>`;
            let removeRowButton = `<button title="Удалить строку" class="delete-button" onclick="TemplateTable.removeRowFromItemTable(this)">&#10006</button>`;

            let modifyColumnElement = `<td class='add-column' rowspan='${item.tableData[1].length+1}'>${addColumnButton}${removeColumnButton}</td>`;
            let modifyRowElement = `<td class='add-row' colspan='${item.tableData[0].length}'>${addRowButton}${removeRowButton}</td>`;


            $($(table).find("tr")[0]).append(modifyColumnElement);
            $(table).append(`<tr>${modifyRowElement}</tr>`);
        } else if (item.type == "tableFree") {
            table =  $.parseHTML("<table class='embedded-table free-table'></table>");
            $(table).append("<tr></tr>");

            let firstRow = $(table).find("tr")[0];
            for(var column in item.tableData) {
                let initValue = item.tableData[column].trim();
                $(firstRow).append(`<td class='column-header'><input data-id='${column}' type='text' placeholder='Столбец' value='${initValue}'></td>`);
            }

            let addColumnButton = `<button class="add-new-button" onclick="TemplateTable.addColumnToItemTable(this)">+</button>`;
            let removeColumnButton = `<button title="Удалить столбец" class="delete-button" onclick="TemplateTable.removeColumnFromItemTable(this)">&#10006</button>`;
            let modifyColumnElement = `<td class='add-column' rowspan='${item.tableData.length}'>${addColumnButton} ${removeColumnButton}</td>`;

            $($(table).find("tr")[0]).append(modifyColumnElement);
        } else {
            //console.log("Попытка отрисовать таблицу провалилась - тип не распознан.");
            table = [""];
        }

        //console.log("Полученная таблица: ");
        //console.log(table);

        return table[0];
    }
}