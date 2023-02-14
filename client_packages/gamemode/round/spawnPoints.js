let blips = [];
let markers = [];
let labels = [];

mp.events.add('createSpawnCreationBlipCop', (player, id) => {
    let policeBlip = mp.blips.new(225, mp.players.local.position,
        {
            name: 'Police blip',
            color: 3,
            shortRange: false,
        }
    );

    let policeMarker = mp.markers.new(1, mp.players.local.position, 2.0,
        {
            color: [7, 0, 255, 200],
            visible: true,
            dimension: mp.players.local.dimension
        }
    );
    
    let policeLabel = mp.labels.new(`ID: ${id}`, mp.players.local.position, {
        los: true,
        font: 7,
        drawDistance: 50,
        color: [255, 255, 255, 200],
        dimension: mp.players.local.dimension
    })

    labels.push(policeLabel);
    markers.push(policeMarker);
    blips.push(policeBlip);
})

mp.events.add('createSpawnCreationBlipSuspect', (player, id) => {
    let suspectBlip = mp.blips.new(225, mp.players.local.position,
        {
            name: 'Suspect blip',
            color: 6,
            shortRange: false,
        }
    );

    let suspectMarker = mp.markers.new(1, mp.players.local.position, 2.0,
        {
            color: [255, 0, 7, 200],
            visible: true,
            dimension: mp.players.local.dimension
        }
    )

    let suspectLabel = mp.labels.new(`ID: ${id}`, mp.players.local.position, {
        los: true,
        font: 7,
        drawDistance: 50,
        color: [255, 255, 255, 200],
        dimension: mp.players.local.dimension
    })

    labels.push(suspectLabel);
    markers.push(suspectMarker);
    blips.push(suspectBlip);
})

mp.events.add('createSpawnCreationBlipHeli', (player, id) => {
    let heliBlip = mp.blips.new(43, mp.players.local.position,
        {
            name: 'Heli blip',
            color: 3,
            shortRange: false,
        }
    );

    let heliMarker = mp.markers.new(34, mp.players.local.position, 2.0,
        {
            color: [7, 0, 255, 200],
            visible: true,
            dimension: mp.players.local.dimension
        }
    )

    let heliLabel = mp.labels.new(`ID: ${id}`, mp.players.local.position, {
        los: true,
        font: 7,
        drawDistance: 50,
        color: [255, 255, 255, 200],
        dimension: mp.players.local.dimension
    })

    labels.push(heliLabel);
    markers.push(heliMarker);
    blips.push(heliBlip);
})

mp.events.add('destroySpawnCreationBlip', (player, id) => {
    for (let i = 0; i < blips.length; i++) {
        blips[i].destroy();
    }

    for (let m = 0; m < markers.length; m++) {
        markers[m].destroy();
    }

    for (let l = 0; l < labels.length; l++) {
        labels[l].destroy();
    }

    labels = [];
    markers = [];
    blips = [];
})
