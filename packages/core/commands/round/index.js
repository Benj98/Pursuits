const { registerCommand, registerAdminCommand } = require('../../command-library/command-library');
const { RoundSpawns } = require('../../database/models/roundSpawns');

let positionData = [];
let spawnId = 1;

registerAdminCommand(
    "setpos",
    "Begin creating spawn points for a lobby.",
    "/setpos [name] [suspect/cop/heli]",
    ["srp"],
    (player, args) => {
        if(!args[0]) return player.outputChatBox(`You must enter either suspect or cop.`);
        let type = args[0];
        if(type !== "suspect" && type !== "cop" && type !== "heli") {
            player.outputChatBox(`Valid arguments: suspect/cop/heli`);
        } else {
            let pos = player.position;

            player.outputChatBox(`Position[${spawnId}] set for ${type}. Use /savepos to finalise.`);

            if(type == "cop") {
                player.call('createSpawnCreationBlipCop', [player]);
            } else {
                player.call('createSpawnCreationBlipSuspect', [player]);
            }

            positionData.push({
                posId: spawnId++,
                team: type,
                x: pos.x,
                y: pos.y,
                z: pos.z
            });

            
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
        if(!positionData.length) return player.outputChatBox(`You must begin creating positions with /setpos [cop/suspect]`);

        const roundSpawns = await RoundSpawns.create({
            name: args[0],
            coordinates: positionData
        })

        await roundSpawns.save();

        player.call('destroySpawnCreationBlip', [player]);
        player.outputChatBox(`Position ${args[0]} saved successfully.`);
        positionData = [];
        spawnId = 1;
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