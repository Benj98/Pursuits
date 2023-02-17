require('./gamemode');

mp.events.add('playerReady', () => {
	let player = mp.players.local;

	player.setCombatRange(2);

	mp.events.call('setLoginCamera');

	setTimeout(() => {
		mp.gui.cursor.show(true, true);
	}, 500)
});

