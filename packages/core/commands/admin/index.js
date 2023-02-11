const {     registerAdminCommand, registerCommand, registerAllCommands, adminCommands } = require('../../command-library/command-library');


async function showAdminCommands(player, page = 1) {
    const commandsPerPage = 4;
    const totalPages = Math.ceil(adminCommands.size / commandsPerPage);
    
    if (page < 1 || page > totalPages) 
        return player.outputChatBox(`Invalid page number. Please enter a value between 1 and ${totalPages}`);

    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const commandsToShow = Array.from(adminCommands).slice(startIndex, endIndex);

    for (const [key, value] of commandsToShow) {
        player.outputChatBox(`Command: ${value.name}`);
        player.outputChatBox(`Description: ${value.description}`);
        player.outputChatBox(`Aliases: ${value.alias}`);
        player.outputChatBox(`<------------------------------------->`)
        
        if (key == endIndex - 1) {
            break;
        }
    }

    player.outputChatBox(`Page ${page} of ${totalPages}`);
}

registerAdminCommand(
    "adminhelp", 
    "Lists all admin commands.", 
    "Usage: /adminhelp [page] - Default 1", 
    ["ahelp"],
    (player, args) => {
        showAdminCommands(player, args[0] ? parseInt(args[0]) : 1);
    }, 1
)

registerAdminCommand(
    "giveweapon",
    "This is a test command using new system.",
    "Usage: /giveweapon [weapon] [ammo]",
    ["wep"],
    (player, args) => {
        const weaponHash = mp.joaat(`weapon_${args[0]}`);
        const ammo = args[1]
        player.giveWeapon(weaponHash, parseInt(ammo));
    }, 2
)

registerAdminCommand("admin", "test admin", "", "a", (player, args) => {
    player.outputChatBox("test admin")
}, 2);

registerCommand("giveadmin", "Give yourself admin", "Usage: /giveadmin [levell]", "sa", (player, args) => {
    player.setVariable('adminLevel', args[0]);
})

registerAdminCommand("spawnveh", 
"Spawn a vehicle at your current position", 
"Usage: /spawn(veh) [name]", 
["veh"], 
(player, args) => {
    if(!args) return player.outputChatBox("You must specify a vehicle name.");
    let veh = mp.vehicles.new(mp.joaat(args[0]), player.position, {
        heading: player.heading,
        numberPlate: "STAFF",
        locked: false,
        engine: true,
        dimension: player.dimension
    });
    player.putIntoVehicle(veh, 0);
}, 2);

registerCommand(
    "fontsize",
    "Adjust the font size of the chat.",
    "/fontsize [0.5-1.5",
    [],
    (player, args) => {
        if(!args) return player.outputChatBox("Enter a font size between 0.5 - 1.5.");
        player.call('fontsize', [player], args[0]);
    }
)

registerAdminCommand(
    "global",
    "Speak in the global chat.",
    "/global [text]",
    ["g"],
    (player, args) => {
        if(!args[0]) return player.outputChatBox("");
        let message = args.join(" ");
        mp.players.broadcast(`[${player.name}]: ${message}`);
    },1
)