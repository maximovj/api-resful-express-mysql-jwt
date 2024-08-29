require('dotenv').config();
const cors = require('cors');

const lstEnv = Object.keys(process.env);
const lstCors = lstEnv.filter(_env => _env.startsWith('APP_CORS_'));
const allowedOrigins = lstCors.map(_env => process.env[_env]);

const configCors = cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Content-Length', 'Origin', 'Authorization'],
    origin: function (origin, callback) {
        const org = origin || null;
        if (allowedOrigins.indexOf(org) === -1 || !org) {
            callback(new Error("CORS denegado."), false)
        }
        callback(null, true);
    }
});

module.exports = configCors;

