require('./gamemode/advancedchat');
require('./gamemode/auth');
require('./gamemode/damage');
require('./gamemode/death');
require('./gamemode/includes/rage-rpc.min.js')
const rpc = require('./gamemode/includes/rage-rpc.min.js');

mp.events.add('client:playerJoin', (player) => {
    mp.events.call('showLogin', player);
})

rpc.register('test', () => {
    mp.gui.chat.push("Hello from rage-rpc.")
})