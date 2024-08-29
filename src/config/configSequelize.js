require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'api_restful_express',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
});

database.validate()
    .then(() => console.log('Base de datos conectado, exitosamente.'))
    .catch(() => console.log('Error en la conexión a la base de datos.'));

module.exports = database;