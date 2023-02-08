require('./register');
require('./login');

mp.events.add("serverRegister", async (player, username, password) => {
    try {
        if(!username || !password) return player.outputChatBox("Error, contact admin.");

        mp.events.call("registerPlayer", player, username, password);
    } catch (error) {
        console.error(error)
    }
});

mp.events.add("serverLogin", async (player, username, password) => {
    try {
        if(!username || !password) return player.outputChatBox("Error, contact admin.");

        mp.events.call("loginPlayer", player, username, password);
    } catch (error) {
        console.error(error);
    }
})

mp.events.add('server:loginSuccess', (player) => {
    setTimeout(() => {
        player.alpha = 1000;
    })
    player.position = new mp.Vector3(441, -982, 30);
})