let lobbybrowser = mp.browsers.new("package://gamemode/lobbyui/html/index.html");
lobbybrowser.active = false;

mp.events.add('triggerLobbyBrowser', (player, lobbies) => {
    mp.events.call('client:receiveLobbies', player, lobbies);
    mp.gui.cursor.show(true, true);
})

mp.events.add('lobbyselect', () => {
    mp.gui.chat.push(`lobby selected`)
})

mp.events.add("client:receiveLobbies", (player, lobbies) => {
    if(!lobbies) return;
    
    lobbybrowser.execute(`showLobbies(${lobbies.id}, ${lobbies.gameStarted});`);

    lobbies.forEach((lobby) => {
        let lobbyStarted;
        if(lobby.gameStarted) {
            lobbyStarted = "<p>In pursuit</p>";
        } else {
            lobbyStarted = "<p>Waiting to start...</p>";
        }

        lobbybrowser.active = !lobbybrowser.active;

        if(!lobbybrowser.active) {
            mp.gui.cursor.show(false, false);
        }
    });
});

mp.events.add('ceftrigger', (lobbyId, lobbyStarted) => {
    mp.gui.chat.push(`ceftrigger - ${lobbyId}, ${lobbyStarted}`)
})