function getTemplates() {
    $.ajax({
        url:"../data/reportTemplate.php",
        method:"GET",
        data:{"action":"get-all"},
        success: function(data) {
            templatesArray = JSON.parse(data);
            //console.log(templatesArray);
        }
    });
}

function getUsers() {
    //console.log("Заполняю таблицу данными...");
    
    $.ajax({
        url:"../data/user.php",
        method:"GET",
        data:{"action":"get-all"},
        success: function(data) {
            userArray = JSON.parse(data);
            //console.log(userArray);

            createTable();
        }
    });
}

function createTable() {
    $("#users-table tbody").html("");
    for (var i in userArray) {
        let newRow = `
        <tr onclick = editUser(${i})>
        <td>${userArray[i]["login"]}</td>
        <td>${userArray[i]["userPassword"]}</td>
        <td>${userRoles[userArray[i]["isAdmin"]]}</td>
        <td class="td-delete">
            <div>

            <button data-id = "${i}" ${userArray[i]["isAdmin"] == 1?'style="visibility: hidden;"':''} class="normal-button" onClick = "accessChange($(this).attr('data-id'))">
            Шаблоны
            </button>

            <button data-id = "${i}" class="delete-button" onclick="tryDelete($(this).attr('data-id'))">
            &#10006
            </button>

            </div>
        </td>
        </tr>`;

        $("#users-table tbody").append(newRow);
    }
}

function editUser(i) {
    //console.log(`Пытаюсь редактировать пользователя ${userArray[i]["login"]}`);
    let id = userArray[i]["id"];
    let login = userArray[i]["login"];
    let password = userArray[i]["userPassword"];
    let isAdmin = userArray[i]["isAdmin"];

    let typeOptions = "";
    for (i in userRoles) {
        typeOptions += `<option ${i == isAdmin? "selected":""} value="${i}">${userRoles[i]}</option>\n`;
    }

    /*let userTypeSelect = `<select class="isAdmin">${typeOptions}
                          </select>`;*/

    $.confirm({
        title:"Изменение пользователя",
        useBootstrap: false,
        animation: 'zoom',
        animateFromElement: false,
        theme: "dark",
        type: "red",
        boxWidth: "300px",
        content: `
            <form action="" class="alert-form">
                <input required type="text" class="login" placeholder="Логин" value = ${login}>
                <input required type="text" class="password" placeholder="Пароль" value = ${password}>
            </form>`,
        buttons: {
            formSubmit: {
                text: "Сохранить",
                btnClass: "btn-green",
                keys: ['enter'],
                action: function() {
                    let login = this.$content.find(".login").val().trim();
                    if (!login) {
                        alertError("Ошибка при вводе", "Пожалуйста, введите логин");
                        return false;
                    }

                    let password = this.$content.find(".password").val().trim();
                    if (!password) {
                        alertError("Ошибка при вводе", "Пожалуйста, введите пароль");
                        return false;
                    }

                    let existingUser = userArray.find(x => x["login"].trim() == login);

                    if (existingUser) {
                        alertError("Ошибка при вводе", "Данный логин уже занят");
                        return false;
                    }

                    let newUser = {"id" : id, "login": login, "password" : password, "isAdmin" : isAdmin};
                    updateUser(newUser);
                }
            },
            cancel: {
                text:"Отмена"
            },
        },
        onContentReady: function() {
            let jc = this;
            this.$content.find('form').on('sumbit',function(e) {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
}

function updateUser(user) {
    $.ajax({
        url: "../data/user.php",
        method: "POST",
        data:{"action":"update", "data":JSON.stringify(user)},
        success: function(data) {
            //console.log("Пользователь успешно обновлён");
            //console.log(data);

            getUsers();
        },

        error: function(request, status, error) {
            //console.log("Ошибка при обновлении пользователя");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });

}

function tryDelete(id) {
    event.stopPropagation();
    //console.log(`Пытаюсь удалить пользователя ${id}...`);
    //console.log("id",id);
    let temp = (userArray[id]["isAdmin"] != 1) || (userArray.find(x => x.id != userArray[id]["id"] && x["isAdmin"] == 1));
    
    if (!temp) {
        //console.log("Невозможно удалить единственного администратора");
        alertError("Ошибка при удалении", "Невозможно удалить единственного администратора");
        return;
    }

    confirm("Удаление пользователя", "Вы действительно хотите удалить этого пользователя?").then(function(answer) {
        if (answer) {
            //console.log("Получено подтверждение");
            deleteUser(userArray[id]["id"]);

        } else {
            //console.log("Удаление отменено");
        }
    });
}

function deleteUser(id) {
    //console.log("Удаляю пользователя");

    $.ajax({
        url:"../data/user.php",
        method:"GET",
        data:{"action":"delete-by-id", "id":id},
        success: function(data) {
            //console.log("Успешно выполнен запрос DELETE BY ID");
            //console.log(data);

            getUsers();
        },
        error: function(request, status, error) {
            //console.log(request);
            //console.log(error);
            //console.log(status);
        }
    });
}

function accessChange(i) {
    event.stopPropagation();

    let userId = userArray[i]["id"];

    selectedTemplates = [];

    let defer = $.Deferred();

    $.ajax({
        url:"../data/userTemplateUsage.php",
        method:"GET",
        data:{"action":"get-by-user-id", "id":userId},
        success: function(data) {
            data = JSON.parse(data);

            //console.log("data", data);

            for (i in data) {
                //console.log("data id", data[i]["templateId"]);
                let templateArrayId = templatesArray.findIndex(x => x["id"] == data[i]["templateId"]);

                //console.log("array id", templateArrayId);

                if (templateArrayId != null) {
                    selectedTemplates.push(templateArrayId);
                }
            }

            //console.log("selected", selectedTemplates);

            defer.resolve(true);
        },
        error: function() {
            defer.resolve(false);
        }
    });

    defer.promise().then(function(answer) {
        if (answer) {

            unselectedTemplates = [];

            for(i in templatesArray) {
                //let tempUsage = selectedTemplates.find(x => x["userId"] == userId && x["templateId"] == templatesArray[i]["id"]);

                let tempUsage = selectedTemplates.find(x => x==i);

                //console.log("tempUsage", tempUsage);

                if (tempUsage == null) {
                    unselectedTemplates.push(i);
                }
            }

            //console.log("unselected", unselectedTemplates);

            openAccessChange(userId);
        }
    });

}

function addTemplate() {
    //console.log("Добавляю разрешение на использование шаблона...");
    let tempId = $(".alert-form .unselected-templates").val();

    if (tempId) {
     let selectedTemplateId = unselectedTemplates [tempId];

    selectedTemplates.push(selectedTemplateId);

    unselectedTemplates.splice(tempId, 1);

    setUnselectedTemplates();
    setSelectedTemplates();
    }   
}

function removeTemplate(id) {
    //console.log("Убираю разрешение на использование шаблона...");

    let removedTemplateId = selectedTemplates[id];
    unselectedTemplates.push(removedTemplateId);
    selectedTemplates.splice(id, 1);

    setUnselectedTemplates();
    setSelectedTemplates();
}    

function setUnselectedTemplates() {

    let selectOptions = "";
    for(var i in unselectedTemplates) {
        let tempTemplate = templatesArray[unselectedTemplates[i]];
        selectOptions += `<option value="${i}">${tempTemplate["template_name"]}</option>\n`;
    }

    $(".alert-form  .unselected-templates").html(selectOptions);
}

function setSelectedTemplates() {
    let selectedTable = "";
    for(var i in selectedTemplates) {
        let tempTemplateId = selectedTemplates[i];
        let tempTemplate = templatesArray[tempTemplateId];
        selectedTable += `
        <tr>
            <td>${tempTemplate["template_name"]}</td>
            <td class="td-delete">
                <button data-id="${i}" type="button" class="delete-button" onclick="removeTemplate($(this).attr('data-id'))">
                    &#10006
                </button>
            </td>
        </tr>\n`;
    }

    $(".alert-form .selected-templates").html(selectedTable);
}

function openAccessChange(userId) {
 
    $.confirm({
        title:"Доступные шаблоны",
        useBootstrap: false,
        animation: "zoom",
        animateFromElement: false,
        theme: "dark",
        type: "red",
        boxWidth: "500px",
        content: `<form class="alert-form">
                    <div>
                        <select class="unselected-templates">
                        </select>
                        <button type="button" class="normal-button" onclick="addTemplate()">
                        Добавить
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Шаблон</th>
                                <th class="td-delete"></th>
                            </tr>
                        </thead>
                        <tbody class= "selected-templates">
                        </tbody>
                    </table>
                  </form>`,
        buttons : {
            formSubmit : {
                text: "Сохранить",
                btnClass: "btn-green",
                keys: ['enter'],
                action: function() {
                    let defer = $.Deferred();

                    $.ajax({
                        url:"../data/userTemplateUsage.php",
                        method:"GET",
                        data:{"action":"delete-by-user-id", "id":userId},
                        success: function(data) {
                            //console.log("Успешно выполнен запрос DELETE BY ID");
                            //console.log(data);
                            defer.resolve(true);
                        },
                        error: function(request, status, error) {
                            //console.log(request);
                            defer.resolve(false);
                        }
                    });

                    defer.promise().then(function(answer) {
                        if (answer) {

                            for (i in selectedTemplates) {
                                let templateId = templatesArray[selectedTemplates[i]]["id"];
                                $.ajax({
                                    url:"../data/userTemplateUsage.php",
                                    method:"POST",
                                    data:{"action":"insert", "data":JSON.stringify({"userId":userId, "templateId":templateId})},
                                    success: function(data) {
                                        //console.log(data);
                                    }
                                });
                            }
                        }
                    });
                }
            },
            cancel : {
                text: "Отмена"
            }
        },
        onContentReady: function() {
            setUnselectedTemplates();
            setSelectedTemplates();
        }
    });
}

function newUser() {
    //console.log("Пытаюсь создать нового пользователя...");

    let typeOptions = "";
    for (i in userRoles) {
        typeOptions += `<option value="${i}">${userRoles[i]}</option>\n`;
    }

    $.confirm({
        title:"Новый пользователь",
        useBootstrap: false,
        animation: 'zoom',
        animateFromElement: false,
        theme: "dark",
        type: "red",
        boxWidth: "300px",
        content: `
            <form action="" class="alert-form">
                <input required type="text" class="login" placeholder="Логин">
                <input required type="text" class="password" placeholder="Пароль">
                    <select class="isAdmin">
                        ${typeOptions}
                    </select>
            </form>`,
        buttons: {
            formSubmit: {
                text: "Добавить",
                btnClass: "btn-green",
                keys: ['enter'],
                action: function() {
                    let login = this.$content.find(".login").val().trim();
                    if (!login) {
                        alertError("Ошибка при вводе", "Пожалуйста, введите логин");
                        return false;
                    }

                    let password = this.$content.find(".password").val().trim();
                    if (!password) {
                        alertError("Ошибка при вводе", "Пожалуйста, введите пароль");
                        return false;
                    }

                    let existingUser = userArray.find(x => x["login"].trim() == login);

                    if (existingUser) {
                        alertError("Ошибка при вводе", "Данный логин уже занят");
                        return false;
                    }

                    let isAdmin = this.$content.find(".isAdmin").val();

                    let newUser = {"login": login, "password" : password, "isAdmin" : isAdmin};
                    addUser(newUser);
                }
            },
            cancel: {
                text:"Отмена"
            },
        },
        onContentReady: function() {
            let jc = this;
            this.$content.find('form').on('sumbit',function(e) {
                e.preventDefault();
                jc.$$formSubmit.trigger('click');
            });
        }
    });
}

function addUser(user) {
    //console.log(user);

    $.ajax({
        url: "../data/user.php",
        method: "POST",
        data:{"action":"insert", "data":JSON.stringify(user)},
        success: function(data) {
            //console.log("Пользователь успешно добавлен");
            //console.log(data);

            getUsers();
        },

        error: function(request, status, error) {
            //console.log("Ошибка при добавлении пользователя");
            //console.log(request);
            //console.log(status);
            //console.log(error);
        }
    });

}

$(function() {
    userRoles = {0 : "Пользователь", 1 : "Администратор"};
    
    userArray = null;
    getUsers();

    templatesArray = null;
    getTemplates();

    $("#users-table").on({
        mouseenter: function () {
            $(this).find(".td-delete div").css('visibility','visible');
        },
        mouseleave: function () {
            $(this).find(".td-delete div").css('visibility','hidden');
        }
    }, "tbody tr");

    $("body").on({
        mouseenter: function () {
            $(this).find(".td-delete button").css('visibility','visible');
        },
        mouseleave: function () {
            $(this).find(".td-delete button").css('visibility','hidden');
        }
    }, ".alert-form tbody tr");
});