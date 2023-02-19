const { RoundSpawns } = require('../database/models/roundSpawns');
const { Sequelize } = require('sequelize');

async function getSpawnCoords() {
    try{
        const spawnPoints = await RoundSpawns.findOne({
            order: Sequelize.literal('RAND()')
        });

        let spawns = JSON.parse(spawnPoints.coordinates);
        return JSON.stringify(spawns);
    } catch(error) {
        console.error(error);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class RoundHandler {
    constructor(lobby, suspects, cops, copPositions, suspectPositions) {
        this.lobby = lobby;
        this.suspects = suspects;
        this.cops = cops;
        this.copPositions = copPositions;
        this.suspectPositions = suspectPositions;
        this.dimension = Math.floor(Math.random() * 5000) + 1;
    }
  
    async spawnPlayers() {
        try {
            const suspects = this.suspects;
            const cops = this.cops;   

            this.suspectPositions = shuffle(this.suspectPositions);   

            let suspectsIndex = 0;

            let copVehicles = ['police', 'police2', 'police3', 'police4'];
            let civVehicles = ['asbo', 'fusilade', 'rancherxl', 'primo2'];   

            mp.players.forEach((player) => {
                
                if (suspects.includes(player.name)) {
                    const spawn = this.suspectPositions[suspectsIndex];  

                    if (spawn) {
                        player.position = new mp.Vector3(spawn.x, spawn.y, spawn.z);
                        player.dimension = this.dimension;
                        
                        player.outputChatBox(`You are a suspect.`);

                        setTimeout(() => {
                            const vehicleHash = civVehicles[Math.floor(Math.random() * civVehicles.length)];
                            const vehicle = mp.vehicles.new(mp.joaat(vehicleHash), player.position, {
                                numberPlate: player.name,
                                heading: spawn.rot,
                                dimension: this.dimension
                            });

                            vehicle.setColor(0, 0);
                            player.putIntoVehicle(vehicle, 0);
                        }, 300);
                        
                        player.call('freezeCopOnSpawn', [player]);
                    }

                    suspectsIndex++;
                    console.log(suspectsIndex);   
                } else if (cops.includes(player.name)) {
                    const spawn = this.copPositions.pop();

                    if (spawn) {
                        player.position = new mp.Vector3(spawn.x, spawn.y, spawn.z);
                        player.dimension = this.dimension;
                        player.outputChatBox(`You are a cop.`);
                        
                        const vehicleHash = copVehicles[Math.floor(Math.random() * copVehicles.length)];
                        const vehicle = mp.vehicles.new(mp.joaat(vehicleHash), player.position, {
                            numberPlate: player.name,
                            heading: spawn.rot,
                            dimension: this.dimension
                        }); 

                        vehicle.setColor(0, 0);
                        player.putIntoVehicle(vehicle, 0);

                        player.call('freezeCopOnSpawn', [player]);
                    }   
                }
            });
            this.startRound();
        } catch(error) {
          console.error(error);
        }
    }

    async startRound() {
        const timerDuration = 300000;
        
        let timerPaused = false;
        let timerRemaining = timerDuration;

        const timerPromise = new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                resolve();
            }, timerRemaining);

            mp.events.add('roundTimerPause', () => {
                if (!timerPaused) {
                    clearTimeout(timeoutId);
                    timerRemaining -= Date.now() - timeoutId._idleStart;
                    timerPaused = true;
                }
            })

            mp.events.add('roundTimerResume', () => {
                if (timerPaused) {
                    timeoutId = setTimeout(() => {
                        resolve();
                    }, timerRemaining);
                    timerPaused = false;
                }
            })
        })
        
        await timerPromise;

        let lobby = lobbyHandler.getLobby(this.lobby);
        lobby.endGame();
    }

    setPlayers(players) {
        this.players = players;
    }

    setCops(cops) {
        this.cops = cops;
    }

    setSuspects(suspects) {
        this.suspects = suspects;
    }

    setCopPositions(copPositions) {
        this.copPositions = copPositions;
    }

    setSuspectPositions(suspectPositions) {
        this.suspectPositions = suspectPositions;
    }

    deleteRound() {
        this.players = [];
        this.cops = [];
        this.suspects = [];
        this.copPositions = [];
        this.suspectPositions = [];

        mp.players.forEachInDimension(this.dimension, (player) => {
            player.position = new mp.Vector3(441, -982, 30);
            player.dimension = 0;
        })

        lobbyHandler.endGame();
    }
}

class Lobby {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.suspects = [];
        this.cops = [];
        this.gameStarted = false;
        this.gameStarting = false;
        this.copPositions = [];
        this.suspectPositions = [];

        this.loadPositions();

        this.roundHandler = new Map();
        
        // this.emptyLobbyChecker = setInterval(() => {
        //     if (this.id === 1) return clearInterval(this.emptyLobbyChecker);

        //     if (this.players.length === 0 && this.id !== 1) {
        //         lobbyHandler.deleteLobby(this.id);
        //         clearInterval(this.emptyLobbyChecker);
        //     } 
        // }, 10000);
    }

    async deleteRound() {
        try {
            this.roundHandler.delete();
        } catch (error) {
            console.log(error);
        }
    }

    async loadPositions() {
        const positionsArray = await getSpawnCoords();
        let spawnPointsArray = JSON.parse(positionsArray);

        for (const pos of spawnPointsArray) {

            if (pos.team === "cop") {
                this.copPositions.push({ x: pos.x, y: pos.y, z: pos.z, rot: pos.rot });
            } else if (pos.team === "suspect") {
                this.suspectPositions.push({ x: pos.x, y: pos.y, z: pos.z, rot: pos.rot });
            }
        }
    }

    addPlayer(player) {
        const currentLobby = lobbyHandler.getLobbyByPlayer(player.name);

        if(this.players.includes(player.name)) {
            return;
        }

        if(currentLobby && currentLobby.id !== this.id) {
            currentLobby.removePlayer(player);
        }

        this.players.push(player.name);

        this.broadcast(`${player.name} joined the lobby.`);
        this.startGameIfReady();

        player.call('removeLobbyCef', [player]);
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

        if(player) {
            player.position = new mp.Vector3(441, -982, 30);
            player.dimension = 0;
        }
    }

    async assignRoles() {
        try {
            const numPlayers = this.players.length;
            const numSuspects = Math.floor(numPlayers / 6);
            const numCops = numPlayers - numSuspects;   
            await this.loadPositions();
            
            const shuffledPlayers = this.shuffle(this.players);
            this.cops = shuffledPlayers.slice(0, numCops);
            this.suspects = []; 

            for (let i = 0; i < this.cops.length; i++) {
              if (i % 5 === 0) {
                this.suspects.push(this.cops[i]);
                this.cops.splice(i, 1);
              }
            }
        } catch(error) {
          console.error(error);
        }
    }      

    async startGame() {
        const roundHandler = new RoundHandler(this.id);
        this.roundHandler.set(this.id, roundHandler)

        this.gameStarting = false;
        await this.assignRoles();

        this.broadcast(`Game starting!`);

        roundHandler.setPlayers(this.players);
        roundHandler.setCops(this.cops);
        roundHandler.setSuspects(this.suspects);
        roundHandler.setCopPositions(this.copPositions);
        roundHandler.setSuspectPositions(this.suspectPositions);

        await roundHandler.spawnPlayers();

        roundHandler.startRound();

        return this.gameStarted = true;
    }

    endGame() {
        this.deleteRound();
        return this.gameStarted = false;
    }

    startGameIfReady() {
        if (this.players.length >= 1 && !this.gameStarted && !this.gameStarting) {
            this.gameStarting = true; 
            this.broadcast(`The game will start in 10 seconds.`);

            setTimeout(() => {
                if (this.players.length >= 1) { 
                    this.startGame();

                } else {
                    this.broadcast(`Not enough players to start the game.`);
                    this.gameStarting = false;
                }
            }, 10000);
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