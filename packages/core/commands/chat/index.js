const { registerAdminCommand, registerCommand } = require('../../command-library/command-library');

registerCommand("me", 
    "Describe an action of your character.", 
    "/me [text]", 
    [], 
    (player, args) => {
        if(!args) return;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, 40, player.dimension, `${player.name} ${text}`);
    }
);

registerCommand("do", 
    "Describe an action of your character.", 
    "/do [text]", 
    [], 
    (player, args) => {
        if(!args) return;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, 40, player.dimension, `${text} (( ${player.name} ))`);
    }
);

registerCommand(
    "low", 
    "Speak quietly.",
    "/low [text]",
    ["l"],
    (player, args) => {
        if(!args) return;
        let text = args.join();
        mp.players.broadcastInRange(player.position, 40, player.dimension, `${player.name} says quietly: ${text}`);
    }
);
