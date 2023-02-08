function onClickSubmit() {
    $("form").on('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.toString();
        const password = document.getElementById("password").value;

        mp.trigger("registerSubmit", username, password);
    })
}

function onButtonClick() {
    mp.trigger('showLogin')
}