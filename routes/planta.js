const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const PlantaController = require('../controllers/planta');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, PlantaController.getPlanta);
router.post('/',login.obrigatorio, PlantaController.postPlanta);
router.get('/:id_planta',login.obrigatorio, PlantaController.getPlanta)
router.patch('/',login.obrigatorio, PlantaController.patchPlanta);
router.delete('/',login.obrigatorio, PlantaController.deletePlanta);
module.exports = router;