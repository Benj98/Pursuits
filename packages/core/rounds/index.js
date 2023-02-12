let lobbies = [];
let nextLobbyId = 1;
let maxPlayers = 20;

const createLobby = async () => {
    const lobbyId = nextLobbyId++;
    const players = [];

    lobbies.push({ lobbyId, players });

    console.log(lobbyId);

    return lobbyId;
}

const addPlayerToLobby = async (player, lobbyId) => {
    const lobby = lobbies.find(i => i.lobbyId === lobbyId);

    if(!lobby) {
        lobbyId = createLobby();
        lobby = lobbies.find(i => i.lobbyId === lobbyId);
    }

    lobby.players.push(player.name);
    player.outputChatBox(`${lobby.players} - ${lobbyId}`);

    if (lobby.players.length > maxPlayers) {
        createLobby();
    }
    
    return lobbyId;
}

createLobby();

mp.events.add('addPlayerToPool', (player) => {
    addPlayerToLobby(player, 1);
})

// mp.events.add('playerQuit', (player) => {
//     numPlayers -= 1;

//     for (let i = 0; i < allLobbies.length; i++) {
//         for (let j = 0; j < allLobbies[i].players.length; j++) {
//             if (allLobbies[i].players[j].id === player.id) {
//                 allLobbies[i].players.splice(j, 1);
//                 break;
//             }
//         }
//     }
// })

// mp.events.add('createLobbies', (player) => {
//     if (numPlayers % maxPlayers === 0) {
//         let lobby = {
//             players: [],
//         };
//         allLobbies.push(lobby);
//     }

//     let lobbyIndex = Math.floor(numPlayers / maxPlayers);
//     allLobbies[lobbyIndex].players.push({
//         id: player.id,
//         name: player.name,
//     });

//     if(lobbies[lobbyIndex].players.length >= 2) {
//         // start lobby
//     }

//     console.log(allLobbies.players);
// });

// mp.events.add('playerLeaveLobby', (player) => {
//     for (let i = 0; i < allLobbies.length; i++) {
//         let index = -1;

//         for (let j = 0; j < allLobbies[i].players.length; j++) {
//             if (allLobbies[i].players[j].id === player.id) {
//                 index = j;
//                 break;
//             }
//         }

//         if (index !== -1) {
//             allLobbies[i].players.splice(index, 1);
//             break;
//         }
//     }
// })