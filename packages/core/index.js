require('./setup');
require('./command-library');
require('./commands');
require('./database');
require('./globals');
require('./auth');
require('./damage');
require('./death');
require('./rounds');
require('./crouch');
require('rage-rpc');

mp.events.add('playerReady', async (player) => {
	console.log(`${player.name} is ready!`);
	
	mp.world.time.hour = 0;

	player.call('client:playerJoin', [player]);
	player.setVariable('adminLevel', 5);
	
	player.data.positonData = [];
	player.data.spawnId = 1;

	player.alpha = 0;
});

mp.events.add("playerChat", (player, text) => {
	let pos = player.position;

	mp.players.broadcastInRange(pos, 40, player.dimension, `${player.name} says: ${text}`);
});

mp.events.add('ceflobbytest', (player) => {
	player.outputChatBox('ceflobbytest')
})