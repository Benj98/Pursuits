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
    creator: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    coordinates: {
        type: Sequelize.JSON,
        allowNull: false
    }
}, { sequelize: datasource, modelName: 'roundSpawns' });

module.exports = {
    RoundSpawns
}