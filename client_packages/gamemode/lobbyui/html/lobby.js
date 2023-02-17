function onLobbyClick() {
    mp.trigger('lobbyselect');
    mp.trigger('lobbyselect2');
}

function showLobbies(lobbyId, lobbyStarted) {
    lobbyStarted = true;
    if ($("#left-div").find(".lobby[data-lobby-id='" + lobbyId + "']").length > 0) {
        console.log("Lobby " + lobbyId + " already exists");
        return;
    }

    let lobbyDiv = $("<div>").addClass("lobby");

    let idP = $("<p>").text("Lobby " + lobbyId);
    lobbyDiv.append(idP);

    let statusP = $("<p>").text(lobbyStarted ? "In pursuit..." : "Ready to join.");
    lobbyDiv.append(statusP);


    mp.trigger('ceftrigger', lobbyId, lobbyStarted);

    $("#left-div-top").after(lobbyDiv);
}