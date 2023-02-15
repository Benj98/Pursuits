require('./gamemode/advancedchat');
require('./gamemode/auth');
require('./gamemode/damage');
require('./gamemode/death');
require('./gamemode/seat');
require('./gamemode/round');
require('./gamemode/keybinds');

mp.events.add('client:playerJoin', (player) => {
    mp.events.call('showLogin', player);
});

mp.events.add('render', () => {
    mp.game.controls.disableControlAction(32, 140, true);
})