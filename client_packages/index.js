require('./gamemode');

mp.events.add('playerReady', () => {
	mp.events.call('setLoginCamera');

	setTimeout(() => {
		mp.gui.cursor.show(true, true);
	}, 500)
});
