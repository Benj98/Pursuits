const {     registerAdminCommand, registerCommand, registerAllCommands, adminCommands } = require('../../command-library/command-library');


registerCommand(
    "fontsize",
    "Adjust the font size of the chat.",
    "/fontsize [0.5-1.5",
    [],
    (player, args) => {
        if(!args) return player.outputChatBox(`Enter a font size between 0.5 - 1.5.`);
        player.call('fontsize', [player]);
    }
)

registerCommand(
    "dimension",
    "View your current dimension",
    "/dimension",
    "dim",
    (player, args) => {
        player.outputChatBox(`Your dimension is ${player.dimension}.`);
    }
)

registerCommand(
    "heading",
    "View your current heading",
    "/heading",
    [],
    (player, args) => {
        player.outputChatBox(`Heading: ${player.heading}`);
    }
)

registerCommand(
    "vehheading",
    "View your vehicle heading",
    "/vehheading",
    [],
    (player, args) => {
        player.outputChatBox(`Veh heading: ${player.vehicle.heading}`);
    }
)