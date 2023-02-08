
mp.events.add('clientPlayerDeath', (player) => {
    mp.players.local.setToRagdoll(5000, 5000, 0, true, true, true);
    player.freezePosition(true);
    console.log(player.freezePosition);
    setTimeout(() => {
        mp.events.callRemote('server:PlayerRespawnFromDeath');
        player.freezePosition(false);
        console.log(player.freezePosition);
    }, 5000)
})