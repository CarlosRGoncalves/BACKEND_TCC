const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const Unidade_medida = require('../controllers/unidade_medida');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, Unidade_medida.getUnidade_medida);
router.post('/', Unidade_medida.postUnidade_medida);
router.get('/:id_unidade_medida',login.obrigatorio, Unidade_medida.getUnidade_medidaID)
router.patch('/:id_unidade_medida', Unidade_medida.patchUnidade_medida);
router.delete('/:id_unidade_medida',login.obrigatorio, Unidade_medida.deleteUnidade_medida);
module.exports = router;