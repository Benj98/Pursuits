let browser = mp.browsers.new("package://gamemode/auth/login/index.html");

mp.events.add('setLoginCamera', () => {
    const x = -385;
	const y = 800.75;
	const z = 423.85;

	mp.players.local.freezePosition(true);
	mp.game.ui.displayRadar(false);
	let sceneryCamera = mp.cameras.new(
	  "default",
	  new mp.Vector3(x, y, z),
	  new mp.Vector3(0, 0, 0),
	  40
	);
  
	mp.players.local.position = new mp.Vector3(x, y, z);
	mp.game.gameplay.setWeatherTypeNowPersist("CLEAR");
	mp.game.invoke("0xF36199225D6D8C86", 0.0);
	sceneryCamera.setActive(true);
	sceneryCamera.shake("HAND_SHAKE", 0.7);
	sceneryCamera.pointAtCoord(402.8664, -996.4108, -98.5);
	mp.game.graphics.transitionToBlurred(500);
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
})

mp.events.add('removeLoginCamera', () => {
    mp.gui.chat.show(true);
    mp.game.cam.renderScriptCams(false, true, 2000, true, false);
    mp.players.local.freezePosition(false);
    mp.game.graphics.transitionFromBlurred(500);
    mp.game.ui.displayRadar(true);

    mp.events.callRemote('server:loginSuccess');
})

mp.events.add('showLogin', () => {
    browser.active = false;
    browser.url = "package://gamemode/auth/login/index.html";
    browser.active = true;
    mp.gui.cursor.show(true, true);
})

mp.events.add('loginSubmit', (username, password) => {
    if(!username || !password) {
        mp.gui.chat.push("Please correct your details.");
        return;
    } else {
        mp.events.callRemote("serverLogin", username, password);
    }
});

mp.events.add('showRegister', () => {
    browser.active = false;
    browser.url = "package://gamemode/auth/register/index.html";
    browser.active = true;
})

mp.events.add('registerSubmit', (username, password) => {
    if(!username || !password) {
        mp.gui.chat.push("Please enter valid details.");
        return;
    } else {
        mp.events.callRemote("serverRegister", username, password);

    }
})

mp.events.add('registerSuccess', (player) => {
    mp.gui.cursor.show(false, false);
    browser.active = false;

    mp.events.call('removeLoginCamera');

    mp.gui.chat.push("[Client] Registration successful.");
})

mp.events.add('loginSuccess', (player) => {
    mp.gui.cursor.show(false, false);
    browser.active = false;

    mp.events.call('removeLoginCamera');

    mp.gui.chat.push("[Client] Login successful.");
})