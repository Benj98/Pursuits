function onLobbyClick() {
    mp.trigger('lobbyselect');
}

// function showLobbies(lobbyId, lobbyStarted, players) {
//     mp.trigger('ceftrigger', lobbyId, lobbyStarted);

//     if ($("#left-div").find(".lobby[data-lobby-id='" + lobbyId + "']").length > 0) {
//         return;
//     }

//     let lobbyDiv = $("<div>").addClass("lobby").attr("data-lobby-id", lobbyId);;
//     let idP = $("<p>").text("Lobby " + lobbyId);
//     lobbyDiv.append(idP);

//     let playersP = $("<p>").text("Players: " + players);
//     lobbyDiv.append(playersP);

//     let statusP = $("<p>").text(lobbyStarted ? "In pursuit..." : "Accepting players");
//     lobbyDiv.append(statusP);

//     $("#left-div-top").after(lobbyDiv);

// }

function showLobbies(lobbies) {
    var str = JSON.stringify(lobbies);
    var lobs = JSON.parse(str);

    lobs.forEach((lobby) => {
        if ($("#left-div").find(".lobby[data-lobby-id='" + lobby.id + "']").length > 0) {
            return;
        }
    
        let lobbyDiv = $("<div>").addClass("lobby").attr("data-lobby-id", lobby.id);

        lobbyDiv.append(
            $("<div>").addClass("column").append($("<p>").text("ID " + lobby.id)),
            $("<div>").addClass("column").append($("<p>").text(lobby.gameStarted ? "Pursuit in progress..." : "Accepting players")),
            $("<div>").addClass("column").append($("<p>").text("Players: " + lobby.players.length))
        );
    
        $("#left-div-top").after(lobbyDiv);

        let lobbyList = $("#left-div").find(".lobby").sort(function(a, b) {
            let idA = parseInt($(a).attr("data-lobby-id"));
            let idB = parseInt($(b).attr("data-lobby-id"));
            return idA - idB;
        });
        
        $("#left-div").find(".lobby").remove();
        $("#left-div-top").after(lobbyList);
    })
}

$(document).on("click", ".lobby p", function() {
    let lobbyId = $(this).closest(".lobby").data("lobby-id");
    console.log("Clicked lobby ID: " + lobbyId);
    mp.trigger('lobbyClick', lobbyId)
  });

function removeLobby(lobbyId) {
    $("#left-div").find(".lobby[data-lobby-id='" + lobbyId + "']").remove();
}

function test() {
    $("#main-div").draggable();

    $(".lobby").click(function() {
    });
}
test()