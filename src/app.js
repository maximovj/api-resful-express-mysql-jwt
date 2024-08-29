require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const configJWT = require('./config/configJWT.js');
const configCors = require('./config/configCors.js');
const database = require('./config/configSequelize.js');
require('./models/user.js');
const authRoutes = require('./routes/authRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const app = express();

// Establecer variables de entorno
app.set('port', process.env.PORT || process.env.APP_PORT || 3000);
app.set('url', process.env.APP_URL || 'http://localhost')
app.set('env', process.env.APP_ENV || 'local');
app.set('src_ssl_key', process.env.SRC_SSL_KEY || '');
app.set('src_ssl_crt', process.env.SRC_SSL_CRT || '');

// Configurar cors
app.use(configCors);

// Habilitar json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monitorear endpoint con morgan
app.use(morgan('dev'));

// Habilitar rutas estáticas
app.use(express.static(path.join(__dirname, 'public')));

// Definir rutas
app.use(authRoutes);
app.use(configJWT, mainRoutes);

// Sincronizar la base de datos
database.sync({ alter: true, force: true }).then(() => console.log('Base de datos sincronizado'));

module.exports = app;