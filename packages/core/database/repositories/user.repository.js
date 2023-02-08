const { User } = require('../models/user');

const userRepository = {
    save: async (user) => {
        try {
            return await User.create(user);
        } catch (error) {
            console.error(error);
        }
    },
    findByUsername: async (username) => {
        try {
            return await User.findOne({ where: { username } });
        } catch(error) {
            console.error(error);
        }
    },
    update: async (username, updateData) => {
        try {
            const user = await User.findByUsername({ where: { username }});
            if(!user) {
                return null;
            }
            return await user.update(updateData);
        } catch (error) {
            console.log(error);
        }
    },
    updateByUsername: async (username, updateData) => {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return null;
            }
            return await user.update(updateData);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {userRepository};