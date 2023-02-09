require('./setup');
require('./command-library');
require('./commands');
require('./database');
require('./globals');
require('./auth');
require('./damage');
require('./death');

mp.events.add('playerReady', (player) => {
	console.log(`${player.name} is ready!`);

	mp.world.time.hour = 0;

	player.call('client:playerJoin', [player]);
	player.setVariable('adminLevel', 5);

	player.alpha = 0;
});

mp.events.add("playerChat", (player, text) => {
	let pos = player.position;

	mp.players.broadcastInRange(pos, 40, `${player.name} says: ${text}`);
});