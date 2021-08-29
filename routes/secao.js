const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const login = require('../middleware/login');
//RETORNA TODOS OD TIPOS DE PLANTAS
router.get('/',login.obrigatorio,(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM secao',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    secao: result.map(tp_secao =>{
                        return {
                            id_secao: tp_secao.id_secao,
                            id_usuario: tp_secao.id_usuario,
                            descricao: tp_secao.descricao,
                            area: tp_secao.area,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os tipos de secões',
                                url: 'http://localhost:3000/secao/' + tp_secao.id_secao
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
});
//INSERE SECAO 
router.post('/',login.obrigatorio,(req, res, next) =>{
    console.log(req.usuario)
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO secao (id_usuario,descricao,area) VALUES (?,?,?)',
            [req.body.id_usuario,req.body.descricao,req.body.area],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta inserido com sucesso',
                    secaoCriado: {
                        usuario: req.body.id_usuario,
                        descricao: req.body.descricao,
                        area: req.body.area,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Secao',
                            url: 'http://localhost:3000/secao'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
});
// RETORNA OS DADOS DE UM TIPO DE PLANTA
router.get('/:id_secao',login.obrigatorio,(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM secao WHERE id_secao =?',
            [req.params.id_secao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de planta com este ID'
                    })
                }
                const response = {
                    tipo_planta: {
                        usuario: result[0].id_usuario,
                        descricao: result[0].descricao,
                        area: result[0].area,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes do Tipo de Planta',
                            url: 'http://localhost:3000/Secao'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
});


router.patch('/',login.obrigatorio,(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE secao SET  descricao = ?, area = ? WHERE id_secao =?',
            [req.body.descricao,req.body.area,req.body.id_secao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta atualizado com sucesso',
                    tipo_plantaAtualizado: {
                        usuario: req.body.id_usuario,
                        descricao: req.body.descricao,
                        area: req.body.area,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Secao',
                            url: 'http://localhost:3000/secao/' + req.body.id_secao
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
});

router.delete('/',login.obrigatorio,(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM tipo_planta WHERE id_secao =?',
            [req.body.id_tipo_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Secao removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descriucao: 'insere um tipo de planta',
                        url:'http://localhost:3000/secao/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
});
module.exports = router;
