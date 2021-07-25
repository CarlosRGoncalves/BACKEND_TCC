const express = require('express');
const app = express();
const rotaUsuarios = require('./routes/usuario');
const rotaTipo_plantas = require('./routes/tipo_planta');

app.use('/tipo_planta',rotaTipo_plantas);

app.use('/usuario',rotaUsuarios);
module.exports = app;
