require('dotenv').config();
const fs = require('fs');
const sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const https = require('https');
const app = express();

app.set('port', process.env.PORT || process.env.APP_PORT || 3000);
app.set('url', process.env.APP_URL || 'http://localhost')
app.set('env', process.env.APP_ENV || 'local');
app.set('src_ssl_key', process.env.SRC_SSL_KEY || '');
app.set('src_ssl_crt', process.env.SRC_SSL_CRT || '');
app.set('hash_jwt', process.env.APP_HASH_JWT || 'shhhh');

const lstEnv = Object.keys(process.env);
const lstCors = lstEnv.filter(_env => _env.startsWith('APP_CORS_'));
const allowedOrigins = lstCors.map(_env => process.env[_env]);

app.use(cors({
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
}));

const database = new sequelize.Sequelize({
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

const users = database.define('users', {
    // Definir la columna `email`
    email: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Definir la columna `password`
    password: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: false,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    alter: true,
});

database.sync({ alter: false, force: false });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const handleJWT = async (req, res, next) => {
    const authorization = req.headers['authorization'] || '';
    const bearer = authorization.includes('Bearer');
    const token = authorization.split(" ")[1];

    if (!bearer || !token) {
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, app.get('hash_jwt'), (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user_session = payload;
        next();
    });
};

app.get('/', handleJWT, (req, res) => {
    res.status(200).json({ message: 'API, Funcionando' });
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const encriptado = await bcryptjs.hash(password, 10);
    await users.create({
        email,
        password: encriptado
    })
        .then(() => res.status(201).json({ message: 'Usuario registrado' }))
        .catch((err) => res.status(500).json({ message: err.message }));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await users.findOne({ where: { email: email } })
        .then((user) => {
            bcryptjs.compare(password, user.password)
                .then((isEquals) => {
                    if (isEquals) {
                        const token = jwt.sign({ id: user.id, email: user.email }, app.get('hash_jwt'), { expiresIn: '30m' });

                        return res.status(200).json({ message: 'Usuario inicio sesión, exitosamente.', token });
                    } else {
                        return res.status(200).json({ message: 'Credenciales incorrectos.' });
                    }
                })
                .catch((err) => res.status(500).json({ message: err.message }));
        })
        .catch((err) => res.status(500).json({ message: err.message }));
});

app.use(express.static('public'));

if (app.get('env') === 'prod') {
    const server = https.createServer({
        key: fs.readFileSync(app.get('src_ssl_key')),
        cert: fs.readFileSync(app.get('src_ssl_crt')),
    }, app).listen(app.get('port'), () => {
        const { address, port } = server.address();
        const url = address || app.get('url');
        console.log(`Https: ON`);
        console.log(`SSL: ON`);
        console.log(`Servidor: ${app.get('env')}`);
        console.log(`Puerto: ${app.get('port')}`);
        console.log(`Listen: ${url}:${port}`);
    });
} else {
    const server = app.listen(app.get('port'), () => {
        const { port } = server.address();
        const url = app.get('url');
        console.log(`Http: ON`);
        console.log(`SSL: OFF`);
        console.log(`Servidor: ${app.get('env')}`);
        console.log(`Puerto: ${app.get('port')}`);
        console.log(`Listen: ${url}:${port}`);
    });
}
