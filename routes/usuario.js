const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const UsuarioControlller = require('../controllers/usuario');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, UsuarioControlller.getUsuario);
router.post('/cadastro',  UsuarioControlller.postUsuarioCad);
router.post('/login',UsuarioControlller.postUsuario);
router.get('/:id_usuario', UsuarioControlller.getUsuarioID)
router.patch('/:id_usuario', UsuarioControlller.patchUsuario);
router.delete('/:id_usuario',login.obrigatorio, UsuarioControlller.deleteUsuario);
module.exports = router;