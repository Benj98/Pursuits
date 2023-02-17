mp.events.add("playerDeath", (player) => {
    player.setVariable('isCrouched', false);
});

let num = 0

mp.events.add("toggleCrouch", (player) => {
    if (player.getVariable('isCrouched') === undefined) {
        player.setVariable('isCrouched', true);
    } else {
        let crouched = !player.getVariable('isCrouched');
        player.setVariable('isCrouched', crouched);
    }
});