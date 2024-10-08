require('dotenv').config();
const bcryptjs = require('bcryptjs');
const users = require('../models/user.js');
const jwt = require('jsonwebtoken');
const hash_jwt = process.env.APP_HASH_JWT || 'shhhh';

const register = async (req, res) => {
    const { email, password } = req.body;
    const encriptado = await bcryptjs.hash(password, 10);
    await users.create({
        email,
        password: encriptado
    })
        .then(() => res.status(201).json({ message: 'Usuario registrado' }))
        .catch((err) => res.status(500).json({ message: err.message }));
}

const login = async (req, res) => {
    const { email, password } = req.body;
    await users.findOne({ where: { email: email } })
        .then((user) => {
            bcryptjs.compare(password, user.password)
                .then((isEquals) => {
                    if (isEquals) {
                        const token = jwt.sign({ id: user.id, email: user.email }, hash_jwt, { expiresIn: '30m' });

                        return res.status(200).json({ message: 'Usuario inicio sesión, exitosamente.', token });
                    } else {
                        return res.status(200).json({ message: 'Credenciales incorrectos.' });
                    }
                })
                .catch((err) => res.status(500).json({ message: err.message }));
        })
        .catch((err) => res.status(500).json({ message: err.message }));
}

module.exports = { register, login };