const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rotaUsuarios = require('./routes/usuario');
const rotaTipo_plantas = require('./routes/tipo_planta');
const rotaSecao = require('./routes/secao');
const rotaPlanta = require('./routes/planta');
const rotaCliente = require('./routes/cliente');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extend: false}));//dados simples
app.use(bodyParser.json());
app.use((req,res,next) =>{
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Origin,Acess-Control-Allow-Header, Content-Type, X-Requrested-With, Accept, Authorization');
    
    if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/tipo_planta',rotaTipo_plantas);
app.use('/usuario',rotaUsuarios);
app.use('/secao',rotaSecao);
app.use('/planta',rotaPlanta);
app.use('/cliente',rotaCliente);

app.use((req, res, next) =>{
    const erro = new Error('Nao encontrado rota');
    erro.status = 404;
    next(erro);
})
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});
module.exports = app;
