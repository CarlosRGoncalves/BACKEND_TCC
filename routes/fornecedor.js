const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const Fornecedor = require('../controllers/fornecedor');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, Fornecedor.getFornecedor);
router.post('/', Fornecedor.postFornecedor);
router.get('/:id_fornecedor',login.obrigatorio, Fornecedor.getFornecedorID)
router.patch('/:id_fornecedor', Fornecedor.patchFornecedor);
router.delete('/:id_fornecedor',login.obrigatorio, Fornecedor.deleteFornecedor);
module.exports = router;