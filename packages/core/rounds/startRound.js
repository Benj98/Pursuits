const { RoundSpawns } = require('../database/models/roundSpawns');
const { Sequelize } = require('sequelize');

async function startRound(lobby) {
    const spawnPoints = await RoundSpawns.findOne({
        order: Sequelize.literal('RAND()')
    })
    const spawnPointsArray = JSON.parse(spawnPoints.coordinates);

    const filteredSuspects = spawnPointsArray.filter(point => point.team === "suspect");
    const filteredCops = spawnPointsArray.filter(point => point.team === "cop");

    const copVehicleModel = 'police';
    const suspectVehicleModel = 'zion';

    for (let i = 0; i < lobby.players.length; i++) {
        const playerName = lobby.players[i];
        const playerTeam = (i % 2 === 0) ? "cop" : "suspect";
        const playerSpawnPoint = (playerTeam === "cop") ? filteredCops.pop() : filteredSuspects.pop();
        const vehicleModel = (playerTeam === 'cop') ? copVehicleModel : suspectVehicleModel

        let x = playerSpawnPoint.x;
        let y = playerSpawnPoint.y;
        let z = playerSpawnPoint.z;

        let heading = playerSpawnPoint.rot;
        let newHeading = heading;

        console.log(`[TEST] ${heading}`);
        
        mp.players.forEach(_player => {
            if(_player.name === playerName) {
                _player.outputChatBox(`Match starting.`);
                _player.outputChatBox(`${playerName} has been assigned to the ${playerTeam} team and will spawn at (${x}, ${y}, ${z})`);
                _player.setVariable('team', playerTeam);

                const vehicle = mp.vehicles.new(vehicleModel, new mp.Vector3(x, y, z), {
                    numberPlate: `${playerName}`,
                    heading: newHeading
                });

                _player.putIntoVehicle(vehicle, 0);

                vehicle.rotation = new mp.Vector3(0, 0, newHeading);

                setTimeout(() => {
                    
                    _player.call('setVehicleRotation', [_player, newHeading]);

                    if(playerTeam === "cop") {
                        _player.call('roundStartFreezeCop', [_player]);
                    }
                }, 300);
            }
        })

        
    }
}

module.exports = { startRound };