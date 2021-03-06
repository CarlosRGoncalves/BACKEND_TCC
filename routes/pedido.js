const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
const PedidoControlller = require('../controllers/pedido');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio, PedidoControlller.getPedido);
router.post('/',PedidoControlller.postPedido);
router.post('/relatorio',PedidoControlller.postPedidoRelatorio);
router.post('/relatorio2',PedidoControlller.postPedidoRelatorio2);
router.get('/:id_pedido',login.obrigatorio, PedidoControlller.getPedidoID)
router.patch('/:id_pedido', PedidoControlller.patchPedido);
router.delete('/:id_pedido',login.obrigatorio, PedidoControlller.deletePedido);
module.exports = router;