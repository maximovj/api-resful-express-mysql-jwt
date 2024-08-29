const https = require('https');
const fs = require('fs');
const app = require('./src/app');

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
