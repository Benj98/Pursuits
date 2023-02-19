let lobbybrowser = mp.browsers.new("package://gamemode/lobbyui/html/index.html");
lobbybrowser.active = false;

mp.events.add('triggerLobbyBrowser', (player, lobbies) => {
    mp.events.call('client:receiveLobbies', player, lobbies);
    mp.gui.cursor.show(true, true);
})

mp.events.add("client:receiveLobbies", (player, lobbies) => {
    if(!lobbies) return;

    lobbybrowser.reload(true);

    lobbybrowser.execute(`showLobbies(${JSON.stringify(lobbies)})`);
    lobbybrowser.active = !lobbybrowser.active;
});

mp.events.add('ceftrigger', (lobbies) => {
    mp.gui.chat.push(`ceftrigger - ${lobbies}`)
})

mp.events.add('destroyLobbyBrowser', () => {
    lobbybrowser.active = false;
    mp.gui.cursor.show(false, false);
})

mp.events.add('lobbyClick', (id) => {
    mp.events.callRemote('joinLobbyFromClient', id);
})

mp.events.add('removeLobbyCef', (player) => {
    if(!lobbybrowser) return;
    if(lobbybrowser.active) {
        lobbybrowser.reload(true);
        lobbybrowser.active = false;
        mp.gui.cursor.show(false, false);
    } else 
        return;
})

mp.keys.bind(0x59, false, () => {
    mp.events.call('destroyLobbyBrowser');
});