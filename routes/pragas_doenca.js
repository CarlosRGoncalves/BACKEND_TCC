const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const P_DoencaController = require('../controllers/pragas_doenca');
//RETORNA TODOS OD TIPOS DE ProducaoS
router.get('/',login.obrigatorio, P_DoencaController.getPragas_doenca);
router.post('/', P_DoencaController.postPragas_doenca);
router.get('/:id_p_doenca',login.obrigatorio, P_DoencaController.getPragas_doencaID)
router.patch('/:id_p_doenca', P_DoencaController.patchPragas_doenca);
router.delete('/:id_p_doenca',login.obrigatorio, P_DoencaController.deletePragas_doenca);
module.exports = router;