const remote = require('electron').remote;

$( document ).ready(function() {
    $("#min-btn").click(function (e) {
        var window = remote.getCurrentWindow();
        window.minimize(); 
    });
    $("#max-btn").click(function (e) {
        var window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();          
        } else {
            window.unmaximize();
        }
    });
    $("#close-btn").click(function (e) {
        var window = remote.getCurrentWindow();
        window.close();
    }); 
})