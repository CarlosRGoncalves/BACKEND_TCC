const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const SecaoController = require('../controllers/secao');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, SecaoController.getSecao);
router.post('/', SecaoController.postSecao);
router.get('/:id_secao',login.obrigatorio,  SecaoController.getSecaoID)
router.patch('/:id_secao',SecaoController.patchSecao);
router.delete('/:id_secao',login.obrigatorio, SecaoController.deleteSecao);
module.exports = router;
