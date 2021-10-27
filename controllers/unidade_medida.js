const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getUnidade_medida =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM unidade_medida',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    unidade_medida: result.map(tp_unidade_medida =>{
                        return {
                            id_unidade_medida: tp_unidade_medida.id_unidade_medida,
                            nome_unidade_medida: tp_unidade_medida.nome_unidade_medida,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos unidade_medidaes',
                                url: process.env.URL_API + 'unidade_medida/' + tp_unidade_medida.id_unidade_medida
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}

//INSERE PLANTA 
exports.postUnidade_medida =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO unidade_medida (nome_unidade_medida) VALUES (?)',
            [req.body.nome_unidade_medida],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Unidade_medida cadastrado com sucesso!!!',
                    unidade_medidaCriado: {
                        nome_unidade_medida: req.body.nome_unidade_medida,
                       
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Unidade_medida',
                            url: process.env.URL_API + 'unidade_medida'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getUnidade_medidaID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM unidade_medida WHERE id_unidade_medida =?',
            [req.params.id_unidade_medida],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de unidade_medida com este ID!!!'
                    })
                }
                const response = {
                    unidade_medida: {
                        id_unidade_medida: result[0].id_unidade_medida,
                        nome_unidade_medida: result[0].nome_unidade_medida,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes dos Unidade_medidaes',
                            url: process.env.URL_API + 'unidade_medida'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchUnidade_medida =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE unidade_medida SET  nome_unidade_medida = ? WHERE id_unidade_medida =?',
            [req.body.nome_unidade_medida,req.params.id_unidade_medida],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Unidade_medida atualizado com sucesso!!!',
                    unidade_medidaAtualizado: {
                        id_unidade_medida: req.body.id_unidade_medida,
                        nome_unidade_medida: req.body.nome_unidade_medida,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Unidade_medida',
                            url: process.env.URL_API + 'unidade_medida/' + req.body.id_unidade_medida
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteUnidade_medida =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM unidade_medida WHERE id_unidade_medida =?',
            [req.params.id_unidade_medida],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Unidade_medida removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'insere uma unidade_medida',
                        url:process.env.URL_API + 'unidade_medida/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


