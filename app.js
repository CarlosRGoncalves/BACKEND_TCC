const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rotaUsuarios = require('./routes/usuario');
const rotaTipo_plantas = require('./routes/tipo_planta');
const rotaSecao = require('./routes/secao');
const rotaPlanta = require('./routes/planta');
const rotaPlantio = require('./routes/plantio');
const rotaCliente = require('./routes/cliente');
const rotaProducao = require('./routes/producao');
const rotaPragas_Doenca = require('./routes/pragas_doenca');
const rotaFornecedor = require('./routes/fornecedor');
const rotaInsumo = require('./routes/insumo');
const rotaColheita = require('./routes/colheita');
const rotaProduto_final = require('./routes/produto_final');
const rotaMiddleware = require('./middleware/login');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extend: false}));//dados simples
app.use(bodyParser.json());
//app.use((req,res,next) =>{

   /* res.header('Acess-Control-Allow-Origin', '*');
    //res.header('Origin,Acess-Control-Allow-Header, Content-Type, X-Requrested-With, Accept, Authorization');
    
    /*if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).send({});
    }
    next();*/
//});

app.use('/tipo_planta',rotaTipo_plantas);
app.use('/usuario',rotaUsuarios);
app.use('/secao',rotaSecao);
app.use('/planta',rotaPlanta);
app.use('/plantio',rotaPlantio);
app.use('/cliente',rotaCliente);
app.use('/producao',rotaProducao);
app.use('/pragas_doenca',rotaPragas_Doenca);
app.use('/fornecedor',rotaFornecedor);
app.use('/insumo',rotaInsumo);
app.use('/colheita',rotaColheita);
app.use('/produto_final',rotaProduto_final);
app.use('/validaToken',rotaMiddleware.obrigatorio,(req,res) =>{
    res.status(200).send({});
});

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
