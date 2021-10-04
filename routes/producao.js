const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const ProducaoController = require('../controllers/producao');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, ProducaoController.getProducao);
router.post('/', ProducaoController.postProducao);
router.get('/:id_producao',login.obrigatorio, ProducaoController.getProducaoID)
router.patch('/:id_producao', ProducaoController.patchProducao);
router.delete('/:id_producao',login.obrigatorio, ProducaoController.deleteProducao);
module.exports = router;