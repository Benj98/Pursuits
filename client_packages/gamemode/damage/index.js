

mp.events.add('playerWeaponShot', () => {
    let weapon = mp.players.local.weapon;
    mp.gui.chat.push(`You shot ${weapon}`);

    mp.events.callRemote('shotFired', weapon);
});

mp.events.add('outgoingDamage', (sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    if(targetEntity && targetEntity.type === "player" && sourceEntity && sourceEntity.type === "ped") {
        mp.events.callRemote('playerAttack', targetEntity, sourceEntity, boneIndex, damage);
        return true;
    }
})

mp.events.add('playerDeath', (player, reason, killer) => {
    if(killer) {
        mp.gui.chat.push(`${killer.name} killed you by ${reason}.`);
    }
})