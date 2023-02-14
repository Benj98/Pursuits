require('./startRound');

const { RoundSpawns } = require('../database/models/roundSpawns');
const { Sequelize } = require('sequelize');

let lobbies = [];
let nextLobbyId = 1;
let maxPlayers = 20;

const createLobby = async () => {
    const lobbyId = nextLobbyId++;
    const players = [];

    lobbies.push({ lobbyId, players });
    return lobbyId;
}

const addPlayerToLobby = async (player, lobbyId) => {
    const lobby = lobbies.find(i => i.lobbyId === lobbyId);

    if(!lobby) {
        lobbyId = createLobby();
        lobby = lobbies.find(i => i.lobbyId === lobbyId);
    }
    
    lobby.players.push(player.name);

    player.outputChatBox(`${lobby.players} has been assigned to lobby ID ${lobbyId}.`);
    player.outputChatBox(`If you don't want to take part in the next game, use /leavelobby.`);
    player.outputChatBox(`You can join a new lobby with /joinlobby. [coming soon]`);

    if (lobby.players.length > maxPlayers) {
        await createLobby();
    }

    player.setVariable('lobbyId', lobbyId);

    if (lobby.players.length >= 1) {
        let timer = 10;

        player.outputChatBox(`10 seconds until round starts...`);
        const intervalId = setInterval(async () => {
            timer--;
            if (timer <= 0 && lobby.players.length >= 1) {

                // TODO: Create function for all of this.
                clearInterval(intervalId);
                player.outputChatBox(`Starting match.`);

                const spawnPoints = await RoundSpawns.findOne({
                    order: Sequelize.literal('RAND()')
                })
                const spawnPointsArray = JSON.parse(spawnPoints.coordinates);

                const filteredSuspects = spawnPointsArray.filter(point => point.team === "suspect");
                const filteredCops = spawnPointsArray.filter(point => point.team === "cop");

                console.log(spawnPoints.name);
                console.log(filteredCops)
                console.log(filteredSuspects)

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

                    player.outputChatBox(`${playerName} has been assigned to the ${playerTeam} team and will spawn at (${x}, ${y}, ${z})`);
                    
                    mp.players.forEach(_player => {
                        if(_player.name === playerName) {
                            const vehicle = mp.vehicles.new(vehicleModel, new mp.Vector3(x, y, z), {
                                numberPlate: `${playerName}`
                            });
                            _player.putIntoVehicle(vehicle, 0);

                            _player.position = new mp.Vector3(x, y, z);

                        }
                    })
                }
            }
        }, 1000);
    } else {
        player.outputChatBox(`There needs to be at least two people to start.`);
    }
    
    return lobbyId;
}

const removePlayerFromLobby = async (player, lobbyId) => {
    const lobby = lobbies.find(i => i.lobbyId === lobbyId);
    
    if(!lobby) return;

    const index = lobby.players.indexOf(player.name);

    if(index !== -1) {
        lobby.players.splice(index, 1);
    }
}

createLobby();

mp.events.add('addPlayerToPool', (player) => {
    addPlayerToLobby(player, 1);
})

mp.events.add('listLobbies', async (player) => {
    const lobbyList = lobbies.map(lobby => `Lobby ${lobby.lobbyId}: ${lobby.players.length} players`);
    player.outputChatBox(`Available lobbies: ${lobbyList.join(' | ')}`);
})

module.exports = {
    lobbies,
    removePlayerFromLobby,
    addPlayerToLobby
}