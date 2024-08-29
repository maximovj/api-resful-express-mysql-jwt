const { DataTypes } = require('sequelize');
const database = require('../config/configSequelize.js');

const users = database.define('users', {
    // Definir la columna `email`
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Definir la columna `password`
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: false,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    alter: true,
});

module.exports = users;