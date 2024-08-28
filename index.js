require('dotenv').config();
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const https = require('https');
const app = express();

app.set('port', process.env.PORT || process.env.APP_PORT || 3000);
app.set('url', process.env.APP_URL || 'http://localhost')
app.set('env', process.env.APP_ENV || 'local');
app.set('src_ssl_key', process.env.SRC_SSL_KEY || '');
app.set('src_ssl_crt', process.env.SRC_SSL_CRT || '');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API, Funcionando' });
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
