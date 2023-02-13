const { registerCommand, registerAdminCommand } = require('../../command-library/command-library');
const { RoundSpawns } = require('../../database/models/roundSpawns');

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
            let pos = player.position;
            if (!player.getVariable('positionData')) player.setVariable('positionData', positionData);

            let positionArray = player.getVariable('positionData');

            if(type == "cop") {
                player.call('createSpawnCreationBlipCop', [player]);
            } else if (type == "suspect") {
                player.call('createSpawnCreationBlipSuspect', [player]);
            } else if (type == "heli") {
                player.call('createSpawnCreationBlipHeli', [player]);
            }

            player.outputChatBox(`Position[${player.data.spawnId}] set for ${type}. Use /savepos to finalise.`);
            positionArray.push({
                posId: player.data.spawnId++,
                team: type,
                x: pos.x,
                y: pos.y,
                z: pos.z
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
    "/deleteposid [spawn ID]",
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

        const names = roundSpawns.map(roundSpawn => roundSpawn.name);

        names.forEach(name => {
            player.outputChatBox(`Spawn point name: ${name}`);
        })
    }, 2
)

registerCommand(
    "lobbies",
    "List all available lobbies.",
    "/lobbies",
    [],
    async (player, args) => {
        mp.events.call('addPlayerToPool', player);
    }
)