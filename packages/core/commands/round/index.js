const { registerCommand, registerAdminCommand } = require('../../command-library/command-library');
const { RoundSpawns } = require('../../database/models/roundSpawns');
const { removePlayerFromLobby, addPlayerToLobby, lobbies } = require('../../rounds/index');

let positionData = [];

registerAdminCommand(
    "setpos",
    "Begin creating spawn points for a lobby.",
    "/setpos [name] [suspect/cop/heli]",
    ["srp"],
    (player, args) => {
        if(!args[0]) return player.outputChatBox(`You must enter either suspect, cop or heli.`);
        let type = args[0];

        if(type !== "suspect" && type !== "cop" && type !== "heli") {
            player.outputChatBox(`Valid arguments: suspect/cop/heli`);
            player.outputChatBox(`You must specify 1 heli spawn, 2 suspect spawns and 18 cop spawns.`);
        
        } else {
            let rot, pos;

            if(player.vehicle) {
                pos = player.vehicle.position;
                rot = player.vehicle.heading;
            } else {
                rot = player.heading;
                pos = player.position;    
            }
            

            if (!player.getVariable('positionData')) player.setVariable('positionData', positionData);

            let positionArray = player.getVariable('positionData');

            if(type == "cop") {
                player.call('createSpawnCreationBlipCop', [player, player.data.spawnId]);
            } else if (type == "suspect") {
                player.call('createSpawnCreationBlipSuspect', [player, player.data.spawnId]);
            } else if (type == "heli") {
                player.call('createSpawnCreationBlipHeli', [player, player.data.spawnId]);
            }

            player.outputChatBox(`Position[${player.data.spawnId}] set for ${type}. Use /savepos to finalise.`);
            positionArray.push({
                posId: player.data.spawnId++,
                team: type,
                x: pos.x,
                y: pos.y,
                z: pos.z,
                rot: rot
            });
            
            player.setVariable('positionData', positionArray);
        }
    },
    2
);

registerAdminCommand(
    "savepos",
    "Finalise setting spawn points for a lobby.",
    "/savepos (Must be currently creating a position with /setpos)",
    ["sp"],
    async (player, args) => {
        if(!args[0]) return player.outputChatBox(`Please enter a name.`);
        if(!player.getVariable('positionData')) return player.outputChatBox(`You must begin creating positions with /setpos [cop/suspect]`);

        let positionArray = player.getVariable('positionData');

        const roundSpawns = await RoundSpawns.create({
            name: args[0],
            creator: player.name,
            coordinates: positionArray
        })

        await roundSpawns.save();

        player.call('destroySpawnCreationBlip', [player]);
        player.outputChatBox(`Position ${args[0]} saved successfully.`);

        player.setVariable('positionData', []);
        player.data.spawnId = 1;
    }, 2
)

registerAdminCommand(
    "deletepos",
    "Delete a spawn position",
    "/deletepos [position name]",
    ["delpos"],
    async (player, args) => {
        if(!args[0]) return player.outputChatBox(`Please enter a name.`);

        const roundSpawn = await RoundSpawns.findOne({ where: { name: args[0] } });

        if (!roundSpawn) return player.outputChatBox(`Spawn point with name ${args[0]} not found.`);

        await roundSpawn.destroy();
        player.outputChatBox(`Spawn point ${args[0]} deleted successfully.`);
    }, 2
)

registerAdminCommand(
    "deletespawnid",
    "Delete a specific spawn ID",
    "/deletespawnid [spawn ID]",
    ["delspawnid"],
    (player, args) => {
        if (!args[0]) return player.outputChatBox(`Please enter an ID.`);
        let id = parseInt(args[0]);

        if (!player.getVariable('positionData')) return player.outputChatBox(`You must begin creating positions with /setpos [cop/suspect]`);

        let positionArray = player.getVariable('positionData');
        let index = positionArray.findIndex(spawn => spawn.posId === id);
        
        if (index === -1) return player.outputChatBox(`No spawn point found with ID: ${id}`);
        
        positionArray.splice(index, 1);
        
        for (let i = 0; i < positionArray.length; i++) {
            positionArray[i].posId = i + 1;
        }
        
        player.setVariable('positionData', positionArray);
        player.outputChatBox(`Spawn point with ID: ${id} has been deleted.`);
    }, 2
)

registerAdminCommand(
    "listpositions",
    "List all spawn positions",
    "/listpositions",
    ["listpos"],
    async (player, args) => {
        const roundSpawns = await RoundSpawns.findAll();

        roundSpawns.forEach(roundSpawn => {
            const coordinates = JSON.parse(roundSpawn.coordinates);
            const posCount = coordinates.length;
            player.outputChatBox(`Spawn point name: ${roundSpawn.name} [${posCount} positions]`);
        });
    },
    2
);

registerAdminCommand(
    "tpspawn",
    "Teleport to a spawn point by name and/or position id.",
    "/tpspawn [name] [posid]",
    [],
    async (player, args) => {
        if(!args[0]) return player.outputChatBox(`Please enter a name or posId.`);

        let posId = parseInt(args[1] || 1);

        const roundSpawn = await RoundSpawns.findOne({ where: { name: args[0] } });

        if (!roundSpawn) {
            const spawnPoint = player.getVariable('positionData').find(spawn => spawn.posId === posId);

            if (spawnPoint) {
                player.position = new mp.Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z);
                player.outputChatBox(`Teleported to ${args[0]}[${posId}].`);
            } else {
                player.outputChatBox(`Spawn point with posId ${posId} not found.`);
            }
        } else {
            const coordinates = JSON.parse(roundSpawn.coordinates);
            const spawnPoint = coordinates.find(spawn => spawn.posId === posId);

            if (spawnPoint) {
                player.position = new mp.Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z);
                player.outputChatBox(`Teleported to ${args[0]}[${posId}].`);
            } else {
                player.outputChatBox(`Spawn point with posId ${posId} not found.`);
            }
        }
    }, 2
)

registerCommand(
    "lobbies",
    "List all available lobbies.",
    "/lobbies",
    [],
    async (player, args) => {
        mp.events.call('listLobbies', player);
    }
)

registerCommand(
    "leavelobby",
    "Leave your current lobby.",
    "/leavelobby",
    [],
    async (player, args) => {
        const lobbyId = player.getVariable('lobbyId');

        if (lobbyId) {
            await removePlayerFromLobby(player, lobbyId);
            player.outputChatBox(`You have left lobby ${lobbyId}`);
            player.setVariable('lobbyId', null);
        } else {
            player.outputChatBox(`You are not in a lobby.`);
        }
    }
)

registerCommand(
    "joinlobby",
    "Join an available lobby.",
    "/joinlobby [lobby id] (Use /lobbies to list available lobbies.",
    [],
    async (player, args) => {
        if(!args[0]) 
            return player.outputChatBox(`You must enter a lobby ID.`);

        const lobbyId = parseInt(args[0]);
        const lobby = lobbies.find(i => i.lobbyId === lobbyId);

        if(!lobby) 
            return player.outputChatBox(`Lobby ${lobbyId} does not exist.`);
        
        if(player.getVariable('lobbyId') === lobbyId)
            return player.outputChatBox(`You are already in lobby ${lobbyId}.`);
                
        addPlayerToLobby(player, lobbyId);
        player.outputChatBox(`You have joined lobby ${lobbyId}`);
    }
)

registerAdminCommand(
    "setcufftimer",
    "Set the time required between cuff attempts.",
    "/setcufftimer [time in ms] (1000 is 1 second)",
    [],
    (player, args) => {
        if(!args[0]) return player.outputChatBox(`Usage: /setcufftimer [time in ms]`);
        if(args[0] < 1000 || args[0] > 15000) return player.outputChatBox(`Please specify a time between 1000-15000`);

        player.call('setCuffTimer', [player, args[0]]);
    }, 5
)