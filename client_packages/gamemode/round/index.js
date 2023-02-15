require('./gamemode/round/spawnPoints');

mp.events.add('roundStartFreezeCop', (player) => {
    mp.players.local.freezePosition(false);

    setTimeout(() => {
        mp.players.local.freezePosition(false);
    }, 7000);
})

mp.events.add('setVehicleRotation', (player, heading) => {
    let vehicle = mp.players.local.vehicle;

    vehicle.setHeading(heading);
})