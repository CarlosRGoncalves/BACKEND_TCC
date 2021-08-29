const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
//RETORNA TODOS USUARIOS
router.get('/',(req, res, next) =>{
    res.status(200).send({
        mensagem: 'Retorna todos os usuarios'
    });
});

//INSERE USUARIOS 
router.post('/cadastro',(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error, resultado)=>{
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length>0){
                res.status(409).send({mensage: 'Usuário já Cadastrado'});
            }else{
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if(errBcrypt){return res.status(500).send({error:errBcrypt});}
                    conn.query(
                        'INSERT INTO usuario (nome,email,telefone,tipo_usuario,senha) VALUES (?,?,?,?,?)',
                        [req.body.nome,req.body.email,req.body.telefone,req.body.tipo_usuario,hash],
                        (error, resultado, field) =>{
                            conn.release();
                            if(error){
                                return res.status(500).send({
                                    error:error,
                                    response: null
                                });
                            }
                            response = {
                                mensagem: 'Usuario criado com sucesso',
                                usuarioCriado: {
                                   id_usuario: resultado.insertId,
                                   email: req.body.email
                                }
                            }
                            res.status(201).send({response});
        
                    })
                })
            }
        })
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

