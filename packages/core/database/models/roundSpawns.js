const { Sequelize, Model, DataTypes } = require('sequelize')
const { datasource } = require('../index');

class RoundSpawns extends Model { }

RoundSpawns.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    coordinates: {
        type: Sequelize.JSON,
        allowNull: false
    }
}, { sequelize: datasource, modelName: 'roundSpawns' });

module.exports = {
    RoundSpawns
}