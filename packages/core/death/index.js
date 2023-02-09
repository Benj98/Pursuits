mp.events.add('playerDeath', (player) => {
    player.call('clientPlayerDeath', [player]);
})

mp.events.add('server:PlayerRespawnFromDeath', (player) => {
    player.outputChatBox("Respawning...");
    player.spawn(player.position);
})

mp.events.add('killedByPlayer', (player, killer, weapon) => {
    killer.outputChatBox(`You killed ${player.name} with a ${weapon}.`);
})