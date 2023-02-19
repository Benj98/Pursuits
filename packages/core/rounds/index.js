require('./lobby');

const { lobbyHandler } = require('./lobby');

let maxPlayers = 20;

const newLobby = lobbyHandler.createLobby(1);
newLobby

const lobby2 = lobbyHandler.createLobby(2);
lobby2

mp.events.add('addPlayerToPool', async (player) => {
  const lobbies = lobbyHandler.getAllLobbies(); 
  let joinedLobby = false;

  if(!lobbies) return player.outputChatBox(`There are no lobbies.`);

  for (let i = 0; i < lobbies.length; i++) {
    const lobby = lobbies[i];

    if (lobby.getPlayerCount() < maxPlayers) { 
      lobby.addPlayer(player);
      joinedLobby = true;

      console.log(lobbies);
      break;
    }
  } 
  if (!joinedLobby) {

    const lobby = lobbyHandler.createLobby('new');
    lobby.addPlayer(player);
    player.outputChatBox(`You've joined a new lobby with ID '${lobby.id}'.`);
    player.outputChatBox(`Players in lobby: ${lobby.getPlayerCount()}`);
  }
});

mp.events.add('joinLobbyFromClient', (player, id) => {
  let lobby = lobbyHandler.getLobby(id);
  if(!lobby) return;

  lobby.addPlayer(player);
})