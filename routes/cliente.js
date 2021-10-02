const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const ClienteController = require('../controllers/cliente');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, ClienteController.getCliente);
router.post('/', ClienteController.postCliente);
router.get('/:id_cliente',login.obrigatorio, ClienteController.getClienteID)
router.patch('/:id_cliente', ClienteController.patchCliente);
router.delete('/:id_cliente',login.obrigatorio, ClienteController.deleteCliente);
module.exports = router;