class Lobby {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.suspects = [];
        this.cops = [];
        this.gameStarted = false;
        this.gameStarting = false;
        
        this.emptyLobbyChecker = setInterval(() => {
            if (this.id === 1) return clearInterval(this.emptyLobbyChecker);

            if (this.players.length === 0 && this.id !== 1) {
                lobbyHandler.deleteLobby(this.id);
                clearInterval(this.emptyLobbyChecker);
            } 
        }, 10000);
    }

    //Check if there are any players in the lobby. Delete if none except lobby 1.
    addPlayer(player) {
        this.players.push(player.name);

        this.broadcast(`${player.name} joined the lobby.`);
        this.startGameIfReady();
    }

    removePlayer(player) {    
        const index = this.players.indexOf(player.name);
    
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    
        const isSuspect = this.suspects.indexOf(player.name) !== -1;
        const isCop = this.cops.indexOf(player) !== -1;
    
        if (isSuspect) {
            this.suspects.splice(this.suspects.indexOf(player.name), 1);
        } else if (isCop) {
            this.cops.splice(this.cops.indexOf(player.name), 1);
        }
    
        if (this.gameStarted && this.players.length === 0) {
            this.endGame();
        }
    }

    assignRoles() {
        const numPlayers = this.players.length;
        const numSuspects = Math.floor(numPlayers / 6); // 1 suspect per 5 cops
        const numCops = numPlayers - numSuspects;
    
        // Shuffle the players
        const shuffledPlayers = this.shuffle(this.players.slice());
    
        // Assign roles to players
        this.suspects = shuffledPlayers.slice(0, numSuspects);
        this.cops = shuffledPlayers.slice(numCops);
    
        // Make sure there is exactly 1 suspect per 5 cops
        while (this.suspects.length < this.cops.length / 5) {
          const extraCop = this.cops.pop();
          this.suspects.push(extraCop);
        }
    }

    async startGame() {
        this.gameStarting = false;
        this.assignRoles();

        this.broadcast(`Game starting!`);

        this.suspects.forEach((player) => {
            this.teamBroadcast(`You are a suspect.`, "suspect");
        })

        this.cops.forEach((player) => {
            this.teamBroadcast(`You are a cop.`, "cop");
        })

        return this.gameStarted = true;
    }

    endGame() {
        return this.gameStarted = false;
    }

    startGameIfReady() {
        if (this.players.length >= 1 && !this.gameStarted && !this.gameStarting) {
            this.gameStarting = true; // Set the gameStarting flag to prevent overlapping game sessions
            this.broadcast(`The game will start in 10 seconds.`);

            setTimeout(() => {
                if (this.players.length >= 1) { // Check if there are still enough players to start the game
                    this.startGame();

                } else {
                    this.broadcast(`Not enough players to start the game.`);
                    this.gameStarting = false; // Reset the gameStarting flag

                }
            }, 10000); // Delay the start of the game by 10 seconds
        }
    }

    broadcast(message) {
        mp.players.forEach((player) => {
            if (this.players.includes(player.name)) {
                player.outputChatBox(message);
            }
        })
    }

    teamBroadcast(message, team) {
        mp.players.forEach((player) => {
            if (this.players.includes(player.name)) {
                if (team === "suspects" && this.suspects.includes(player.name)) {
                    player.outputChatBox(message);
                } else if (team === "cops" && this.cops.includes(player.name)) {
                    player.outputChatBox(message);
                } else if (!team) {
                    player.outputChatBox(message);
                }
            }
        });
    }
    
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getPlayerCount() {
        return this.players.length;
    }

    getSuspectCount() {
        return this.players.length;
    }

    getCopCount() {
        return this.cops.length;
    }
}

class LobbyHandler {
    constructor() {
      this.lobbies = new Map();
    }
  
    createLobby(id) {
      const lobby = new Lobby(id);
      this.lobbies.set(id, lobby);
      return lobby;
    }
  
    deleteLobby(id) {
        const lobby = this.lobbies.get(id);
        
        if (lobby) {
          if (this.lobbies.size > 1 && lobby !== this.lobbies.values().next().value) {
            this.lobbies.delete(id);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
    }

    getLobby(id) {
        return this.lobbies.get(id);
    }
  
    getAllLobbies() {
      return [...this.lobbies.values()];
    }

    getLobbyByPlayer(player) {
        for (const lobby of this.lobbies.values()) {
            if (lobby.players.includes(player)) {
                return lobby;
            }
        }
        return null;
    }
}

const lobbyHandler = new LobbyHandler();

module.exports = {
    Lobby,
    LobbyHandler,
    lobbyHandler
}