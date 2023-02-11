
mp.events.add('clientPlayerDeath', (player) => {
    mp.players.local.setToRagdoll(5000, 5000, 0, true, true, true);
    setTimeout(() => {
        mp.events.callRemote('server:PlayerRespawnFromDeath');
    }, 5000)
})