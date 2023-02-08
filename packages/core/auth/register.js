const bcrypt = require('bcrypt');
const { User } = require('../database/models/user');

const hashPass = async(password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

mp.events.add("registerPlayer", async (player, username, password) => {
    if(!password) return;
    let cleanPass = await hashPass(password);

    try {
        const newUser = await User.create({
            username: username,
            password: cleanPass,
            socialClub: player.socialClub
        })

        player.name = username;
        player.call('registerSuccess', [player]);
        
        mp.events.call('server:loginSuccess', player);
        
        player.alpha = 1;

        return newUser;
    } catch (error) {
        console.error(error);
    }
})
