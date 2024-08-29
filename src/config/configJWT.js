require('dotenv').config();
const jwt = require('jsonwebtoken');
const hash_jwt = process.env.APP_HASH_JWT || 'shhhh';

const configJWT = async (req, res, next) => {
    const authorization = req.headers['authorization'] || '';
    const bearer = authorization.includes('Bearer');
    const token = authorization.split(" ")[1];

    if (!bearer || !token) {
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, hash_jwt, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user_session = payload;
        next();
    });
};

module.exports = configJWT;