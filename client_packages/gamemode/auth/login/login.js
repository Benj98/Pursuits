function onClickSubmit() {
    $("form").on('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.toString();
        const password = document.getElementById("password").value;

        mp.trigger('loginSubmit', username, password);
    })
}

function onButtonClick() {
    const register = document.getElementById("register");
    mp.trigger('showRegister')
}