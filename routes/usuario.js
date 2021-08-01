const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS USUARIOS
router.get('/',(req, res, next) =>{
    res.status(200).send({
        mensagem: 'Retorna todos os usuarios'
    });
});

//INSERE USUARIOS 
router.post('/',(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        console.log("ENTROU")
        conn.query(
            'INSERT INTO usuario (nome,email,telefone,tipo_usuario,senha) VALUES (?,?,?,?,?)',
            [req.body.nome,req.body.email,req.body.telefone,req.body.tipo_usuario,req.body.senha],
            (error, resultado, field) =>{
                conn.release();
                if(error){
                    return res.status(500).send({
                        error:error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Usuario inserido com sucesso',
                    id_usuario: resultado.insertId
                });
            }
        )
    })
 
});
// RETORNA OS DADOS DE UM USUARIO
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

