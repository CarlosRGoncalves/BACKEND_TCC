const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const tipo_plantaController = require('../controllers/tipo_planta');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, tipo_plantaController.gettipo_planta);
router.post('/', tipo_plantaController.posttipo_planta);
router.get('/:id_tipo_planta',login.obrigatorio, tipo_plantaController.gettipo_plantaID)
router.patch('/:id_tipo_planta', tipo_plantaController.patchtipo_planta);
router.delete('/:id_tipo_planta',login.obrigatorio, tipo_plantaController.deletetipo_planta);
module.exports = router;