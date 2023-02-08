mp.events.add('playerDeath', (player) => {
    player.call('clientPlayerDeath', [player]);
})

mp.events.add('server:PlayerRespawnFromDeath', (player) => {
    player.outputChatBox("Respawning...");
    player.spawn(player.position);
})