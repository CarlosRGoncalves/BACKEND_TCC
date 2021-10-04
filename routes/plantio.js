const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const PlantioController = require('../controllers/plantio');
//RETORNA TODOS OD TIPOS DE PlantioS
router.get('/',login.obrigatorio, PlantioController.getPlantio);
router.post('/', PlantioController.postPlantio);
router.get('/:id_plantio',login.obrigatorio, PlantioController.getPlantioID)
router.patch('/:id_plantio', PlantioController.patchPlantio);
router.delete('/:id_plantio',login.obrigatorio, PlantioController.deletePlantio);
module.exports = router;