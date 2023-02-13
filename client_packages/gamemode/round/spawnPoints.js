let blips = [];

mp.events.add('createSpawnCreationBlipCop', () => {
    let policeBlip = mp.blips.new(225, mp.players.local.position,
        {
            name: 'Police blip',
            color: 3,
            shortRange: false,
        }
    );

    blips.push(policeBlip);
})

mp.events.add('createSpawnCreationBlipSuspect', () => {
    let suspectBlip = mp.blips.new(225, mp.players.local.position,
        {
            name: 'Suspect blip',
            color: 6,
            shortRange: false,
        }
    );

    blips.push(suspectBlip);
})

mp.events.add('createSpawnCreationBlipHeli', () => {
    let suspectBlip = mp.blips.new(43, mp.players.local.position,
        {
            name: 'Heli blip',
            color: 3,
            shortRange: false,
        }
    );

    blips.push(suspectBlip);
})

mp.events.add('destroySpawnCreationBlip', () => {
    for (let i = 0; i < blips.length; i++) {
        blips[i].destroy();
    }

    blips = [];
})