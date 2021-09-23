const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS OD TIPOS DE PLANTAS
exports.gettipo_planta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM tipo_planta',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    tipo_plantas: result.map(tp_plantas =>{
                        return {
                            id_tipo_planta: tp_plantas.id_tipo_plantas,
                            id_usuario: tp_plantas.id_usuario,
                            nome: tp_plantas.nome,
                            descricao: tp_plantas.descricao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os tipos de plantas',
                                url: 'http://localhost:3006/tipo_planta/' + tp_plantas.id_tipo_plantas
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}

//INSERE TIPO PLANTA 
exports.posttipo_planta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO tipo_planta (id_usuario,nome,descricao) VALUES (?,?,?)',
            [req.body.id_usuario,req.body.nome,req.body.descricao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta inserido com sucesso',
                    tipo_plantaCriado: {
                        usuario: req.body.id_usuario,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Tipo de Planta',
                            url: 'http://localhost:3006/tipo_planta'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DE UM TIPO DE PLANTA
exports.gettipo_plantaID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM tipo_planta WHERE id_tipo_plantas =?',
            [req.params.id_tipo_planta],
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
                        nome: result[0].nome,
                        descricao: result[0].descricao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes do Tipo de Planta',
                            url: 'http://localhost:3006/tipo_planta'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchtipo_planta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE tipo_planta SET nome = ?, descricao = ? WHERE id_tipo_plantas =?',
            [req.body.nome,req.body.descricao,req.params.id_tipo_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta atualizado com sucesso',
                    tipo_plantaAtualizado: {
                        usuario: req.body.id_usuario,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Tipo de Planta',
                            url: 'http://localhost:3006/tipo_planta/' + req.body.id_tipo_planta
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deletetipo_planta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM tipo_planta WHERE id_tipo_plantas =?',
            [req.params.id_tipo_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descriucao: 'insere um tipo de planta',
                        url:'http://localhost:3006/tipo_planta/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


