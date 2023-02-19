require('./gamemode/round/spawnPoints');

mp.events.add('freezeCopOnSpawn', (player) => {
    mp.players.local.freezePosition(true);

    setTimeout(() => {
        mp.players.local.freezePosition(false);
    }, 7000);
})