const { Sequelize, Model } = require('sequelize');

const datasource = new Sequelize("newpursuits", "root", "", {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});

datasource.authenticate().then(async () => {
    const { User } = require('./models/user');
    const { RoundSpawns } = require('./models/roundSpawns');
    const { userRepository } = require("./repositories/user.repository");
    
    console.log(`Connection successful!`);
    await datasource.sync({ alter: true })
}).catch((err) => {
    console.error(err);
})

module.exports = {
    datasource
}