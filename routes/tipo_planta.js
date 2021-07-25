const express = require('express');
const router = express.Router();

//RETORNA TODOS USUARIOS
router.get('/',(req, res, next) =>{
    res.status(200).send({
        mensagem: 'Retorna todos os tipos de plantas'
    });
});

//INSERE USUARIOS 
router.post('/',(req, res, next) =>{
    res.status(201).send({
        mensagem: 'Insere um usuario'
    });
});
// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_usuario',(req, res, next) =>{
    const id = req.params.id_usuario
    if(id === 'especial'){
        res.status(200).send({
            mensagem: 'Voce descobriu o ID especial',
            id: id
        });
    }else {
        res.status(200).send({
            mensagem: 'Voce passou ID'
        });
    }
});


router.patch('/',(req, res, next) =>{
    res.status(201).send({
        mensagem: 'Usuario alterado'
    });
});

router.delete('/',(req, res, next) =>{
    res.status(201).send({
        mensagem: 'Delete dentro da rota de usuarios'
    });
});
module.exports = router;

