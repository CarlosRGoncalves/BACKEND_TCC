const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const InsumoController = require('../controllers/insumo');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, InsumoController.getInsumo);
router.post('/', InsumoController.postInsumo);
router.get('/:id_insumo',login.obrigatorio, InsumoController.getInsumoID)
router.patch('/:id_insumo', InsumoController.patchInsumo);
router.delete('/:id_insumo',login.obrigatorio, InsumoController.deleteInsumo);
module.exports = router;