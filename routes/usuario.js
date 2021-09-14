const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const UsuarioControlller = require('../controllers/usuario');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, UsuarioControlller.getUsuario);
router.post('/cadastro',login.obrigatorio, UsuarioControlller.postUsuarioCad);
router.post('/login',login.obrigatorio, UsuarioControlller.postUsuario);
router.get('/:id_usuario',login.obrigatorio, UsuarioControlller.getUsuario)
router.patch('/',login.obrigatorio, UsuarioControlller.patchUsuario);
router.delete('/',login.obrigatorio, UsuarioControlller.deleteUsuario);
module.exports = router;