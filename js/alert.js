function alertError(alertTitle, alertBody) {
    $.alert({
        title: alertTitle,
        content: alertBody,
        useBootstrap: false,
        boxWidth: "300px",
        animation: 'zoom',
        animateFromElement: false,
        theme: "dark",
        type: "red",
        buttons : {
            cancel: {
                text:"Ок"
            }
        },
        escapeKey:"cancel"
    });
}

function confirm(confirmTitle, confirmBody) {
    var defer = $.Deferred();
    $.confirm({
        title: confirmTitle,
        content: confirmBody,
        useBootstrap: false,
        boxWidth: "300px",
        animation: "zoom",
        animateFromElement: false,
        theme: "dark",
        type: "orange",

        buttons: {
            confirm: {
                text: "Ок",
                btnClass:"btn-red",
                keys: ['enter'],
                action: function () {
                    defer.resolve(true);
                }
            },

            cancel: {
                text: "Отмена",
                keys: ['esc'],
                action: function () {
                    defer.resolve(false);
                }
            }
        },
        escapeKey:"cancel"
        }
    );

    return defer.promise();
}