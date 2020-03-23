<!DOCTYPE html>
<html lang="ru">
<head>

    <title>Система администрирования</title>

    <meta charset="UTF-8">

    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/animations.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/report-template-editor.css">

    <link rel="stylesheet" href="css/admin.css">

    <script src="../lib/jquery-3.4.1.min.js"></script>

    <script src="../lib/jquery-confirm/jquery-confirm.min.js"></script>
    <link rel="stylesheet" href="../lib/jquery-confirm/jquery-confirm.min.css">
    <link rel="stylesheet" href="../css/alert.css">
    <script src="../js/alert.js"></script>

    <script src="js/main.js"></script>

</head>
<body>

    <header>
    <button  id="back-button" onclick ="window.location = '../menu.php';">Назад</button>
    <button onclick="newUser()">Добавить пользователя</button>
        <!-- <button id="users-button" value="users-page">Пользователи</button>
        <button id="templates-button" value="templates-page">Шаблоны</button> -->
    </header>
    
    <div id="container">
		<table id="users-table">
			<thead>
                <tr>
                    <th>Логин</th>
                    <th>Пароль</th>
                    <th>Уровень доступа</th>
                    <th class="td-delete"></th>
                </tr>
            </thead>
			<tbody></tbody>
		</table>
    </div>
    <div class="flex-filler"></div>
</body>
</html>