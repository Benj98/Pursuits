const { Sequelize, Model, DataTypes } = require('sequelize')
const { datasource } = require('../index');

const adminLevel = {
    Management: 5,
    Senior: 4,
    Admin: 3,
    Moderator: 2,
    Support: 1,
    Player: 0
}

class User extends Model {}
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    socialClub: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, { sequelize: datasource, modelName: 'user' });

module.exports = {
    User
}