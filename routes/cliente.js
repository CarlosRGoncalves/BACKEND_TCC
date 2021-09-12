const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const ClienteController = require('../controllers/cliente');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',,login.obrigatorio, ClienteController.getCliente);
router.post('/',login.obrigatorio, ClienteController.postCliente);
router.get('/:id_cliente',,login.obrigatorio, ClienteController.getCliente2)
router.patch('/',login.obrigatorio, ClienteController.patchCliente);
router.delete('/',login.obrigatorio, ClienteController.deleteCliente);
module.exports = router;