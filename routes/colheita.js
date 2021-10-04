const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const ColheitaController = require('../controllers/colheita');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, ColheitaController.getColheita);
router.post('/', ColheitaController.postColheita);
router.get('/:id_colheita',login.obrigatorio, ColheitaController.getColheitaID)
router.patch('/:id_colheita', ColheitaController.patchColheita);
router.delete('/:id_colheita',login.obrigatorio, ColheitaController.deleteColheita);
module.exports = router;