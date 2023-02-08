require('./gamemode/advancedchat');
require('./gamemode/auth');
require('./gamemode/damage');
require('./gamemode/death');
require('./gamemode/seat');
require('./gamemode/includes/rage-rpc.min.js')
const rpc = require('./gamemode/includes/rage-rpc.min.js');

mp.events.add('client:playerJoin', (player) => {
    mp.events.call('showLogin', player);
})