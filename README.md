# api-resful-express-mysql-jwt
Este repositorio contiene un proyecto API RestFul usando los siguientes módulos de NodeJS:

Express + Sequelize + MYSQL + JSON Web Token + BCryptJS + CORS + HTTPS

# Paquetes instalados

Este proyecto contiene, los sig. módulos instalados:

- dotenv ^16.4.5
- express ^4.19.2
- morgan ^1.10.0
- bcryptjs: ^2.4.3
- cors: ^2.8.5
- https: ^1.0.0
- jsonwebtoken: ^9.0.2
- mysql2: ^3.11.0
- sequelize: ^6.37.3

Este proyecto contiene, los sig. módulos para desarrollo:

- @eslint/js  ^9.9.0
- eslint ^9.9.0
- globals ^15.9.0
- nodemon ^3.1.4

# Nota: Requisitos

Es necesario modificar y establecer variables de entorno, usando el archivo ``.env`` 

con la siguiente variables de entorno para la ejecución

```text
APP_PORT=4000
APP_URL=http://localhost
APP_ENV=local

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=api_restful_express
DB_DIALECT=mysql

# Lista blanca de orígenes permitidos
APP_CORS_1=http://localhost:4000

# SSL Certificados
SRC_SSL_KEY=
SRC_SSL_CRT=

# JSON Web Token
APP_HASH_JWT="shhhhh"
```

Adicionalmente habilite la sincronización de la base de datos, para que el ORM de Sequelize pueda crear automáticamente las tablas.

Esto solo se tiene que hacer una vez, después se puede deshabilitar de nuevo.

```js
// Sincronizar la base de datos
database.sync({ alter: true, force: true }).then(() => console.log('Base de datos sincronizado'));
```

# Comandos utilizados

```shell
$ npm install express sequelize mysql2 dotenv morgan body-parser  cors https jsonwebtoken bcryptjs
```

```shell
$ npm install -D nodemon
```

```shell
$ npm init @eslint/config
```

# Comandos de ejecución

```shell
$ npm start
```

```shell
$ npm run dev
```
