const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const PlantaController = require('../controllers/planta');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, PlantaController.getPlanta);
router.post('/', PlantaController.postPlanta);
router.get('/:id_planta',login.obrigatorio, PlantaController.getPlantaID)
router.patch('/:id_planta', PlantaController.patchPlanta);
router.delete('/:id_planta',login.obrigatorio, PlantaController.deletePlanta);
module.exports = router;