const fs = require('fs');
let weaponDamages;

fs.readFile('./weaponDamages.json', 'utf-8', (err, data) => {
    if(err) throw err;
    weaponDamages = JSON.parse(data);
})

console.log(weaponDamages);

mp.events.add('playerAttack', (player, sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    player.outputChatBox(`${targetPlayer.name}`)
    
    // if(weaponDamages.pistols[0].hasOwnProperty(weapon)) {
    //     targetPlayer.health = targetPlayer.health - weaponDamages[weapon];
    // } else {
    //     targetPlayer.health = targetPlayer.health - 10;
    // }
    player.outputChatBox(`${targetEntity} + ${sourceEntity} + ${boneIndex} + ${damage}`);
})

mp.events.add('shotFired', (player, weapon) => {
    if(weaponDamages.pistols.hasOwnProperty(weapon)) {
        player.outputChatBox('Custom damages!');
    } else {
        player.outputChatBox('No custom damages. :(');
    }

})