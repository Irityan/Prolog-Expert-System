function exitWarning(returnPage) {
    confirm("Выход", "Вы действительно хотите выйти без сохранения?").then(function(answer) {
        if (answer) {
            window.location = returnPage;
        } else {
            //console.log("Выход отменён");
        }
    });
}