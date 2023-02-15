require('./startRound');
require('./cuff');

const { RoundSpawns } = require('../database/models/roundSpawns');
const { Sequelize } = require('sequelize');
const { startRound } = require('./startRound');

let lobbies = [];
let nextLobbyId = 1;
let maxPlayers = 20;

const createLobby = async () => {
    const lobbyId = nextLobbyId++;
    const players = [];

    lobbies.push({ lobbyId, players });
    return lobbyId;
}

const handleLobby = async (lobbyId) => {

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

    if (lobby.players.length >= 2) {
        const countdownLength = 5;
        let countdown = countdownLength;

        player.outputChatBox(`${countdown} seconds until round starts...`);
        const intervalId = setInterval(async () => {
            countdown--;
            if (countdown <= 0 && lobby.players.length >= 2) {
                clearInterval(intervalId);
                startRound(lobby);
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