const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const Produto_finalController = require('../controllers/produto_final');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, Produto_finalController.getProduto_final);
router.post('/', Produto_finalController.postProduto_final);
router.get('/:id_produto_final',login.obrigatorio, Produto_finalController.getProduto_finalID)
router.patch('/:id_produto_final',Produto_finalController.patchProduto_final);
router.delete('/:id_produto_final',login.obrigatorio, Produto_finalController.deleteProduto_final);
module.exports = router;