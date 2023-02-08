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