require('./gamemode/rage-rpc/rage-rpc.min.js');
require('./gamemode/advancedchat');
require('./gamemode/auth');
require('./gamemode/damage');
require('./gamemode/death');
require('./gamemode/seat');
require('./gamemode/round');
require('./gamemode/keybinds');
require('./gamemode/lobbyui');
require('./gamemode/crouch');

mp.events.add('client:playerJoin', (player) => {
    mp.events.call('showLogin', player);
});

mp.events.add('render', () => {
    mp.game.controls.disableControlAction(32, 140, true);
    let isTyping = mp.players.local.isTypingInTextChat;


})