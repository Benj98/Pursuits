const fs = require('fs');
let weaponDamages;

fs.readFile('./weaponDamages.json', 'utf-8', (err, data) => {
    if(err) throw err;
    weaponDamages = JSON.parse(data);
})

const calculateDamages = async (player, targetPlayer, weapon, boneIndex) => {
    player.outputChatBox("calculateDamages script runs.");
    if(boneIndex == 98) {
        player.outputChatBox("Headshot!");
    }
}

mp.events.add('playerAttack', async (player, sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
    await calculateDamages(player, targetPlayer, weapon, boneIndex);
    player.outputChatBox(`[DEBUG] Hit player: ${targetPlayer.name} | Bone hit: ${boneIndex} | Damage dealt: ${damage} | Weapon: ${weapon}`);
    targetPlayer.outputChatBox(`[DEBUG] Hit by: ${player.name} | Bone hit: ${boneIndex} | Damage received: ${damage} | Weapon: ${weapon}`);

    console.log(`${sourceEntity} + ${targetEntity}`);    

    console.log(`${targetPlayer.name} was hit by ${player.name} for ${damage} damage.`);
})

mp.events.add('shotFired', (player, weapon) => {
    // if(weaponDamages.pistols.hasOwnProperty(weapon)) {
    //     player.outputChatBox('Custom damages!');
    // } else {
    //     player.outputChatBox('No custom damages. :(');
    // }
})