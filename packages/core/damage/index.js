const fs = require('fs');
let weaponDamages;

fs.readFile('./weaponDamages.json', 'utf-8', (err, data) => {
    if(err) throw err;
    weaponDamages = JSON.parse(data);
})


mp.events.add('playerAttack', (player, sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    player.outputChatBox(`[DEBUG] Hit player: ${targetPlayer.name} + Bone hit: ${boneIndex} + Damage dealt: ${damage} + Weapon: ${weapon}`);
    targetPlayer.outputChatBox(`[DEBUG] Hit by: ${player.name} + Bone hit: ${boneIndex} + Damage received: ${damage} + Weapon: ${weapon}`);
    

    console.log(`${targetPlayer.name} was hit by ${player.name} for ${damage} damage.`);
    // if(weaponDamages.pistols[0].hasOwnProperty(weapon)) {
    //     targetPlayer.health = targetPlayer.health - weaponDamages[weapon];
    // } else {
    //     targetPlayer.health = targetPlayer.health - 10;
    // }
})

mp.events.add('shotFired', (player, weapon) => {
    if(weaponDamages.pistols.hasOwnProperty(weapon)) {
        player.outputChatBox('Custom damages!');
    } else {
        player.outputChatBox('No custom damages. :(');
    }

})