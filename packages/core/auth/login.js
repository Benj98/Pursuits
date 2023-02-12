const  bcrypt = require('bcrypt');
const { User } = require('../database/models/user');
const { userRepository } = require('../database/repositories/user.repository.js');


mp.events.add('loginPlayer', async (player, username, password) => {
    var account = await userRepository.findByUsername(username);

    try {
        if(!account) {
            player.outputChatBox("This account does not exist.");
        } else {
            const hash = await account.password;
            const comparePass = await bcrypt.compare(password, hash);

            if(comparePass) {
                player.outputChatBox(`Logged into account: ${account.username}.`);
                player.call('loginSuccess', [player]);
                mp.events.call('server:loginSuccess', player);

                player.name = username;
                player.alpha = 1;
                
                mp.events.call('addPlayerToPool', player);
                return account;
            } else {
                return player.outputChatBox("Incorrect password.");
            }
        }        
    } catch (error) {
        console.error(error);
    }
})