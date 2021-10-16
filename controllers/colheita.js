const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getColheita =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM colheita',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    colheita: result.map(tp_colheita =>{
                        return {
                            id_colheita: tp_colheita.id_colheita,
                            id_producao: tp_colheita.id_producao,
                            id_pedido: tp_colheita.id_pedido,
                            data_colheita: tp_colheita.data_colheita,
                            quantidade: tp_colheita.quantidade,
                            request: {
                                tipo: 'GET',
                                id_pedido: 'Retorno de todos as colheitas',
                                url: process.env.URL_API + 'colheita/' + tp_colheita.id_colheita
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
exports.postColheita =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO colheita (id_producao,id_pedido,data_colheita,quantidade) VALUES (?,?,?,?)',
            [req.body.id_producao,req.body.id_pedido,req.body.data_colheita,req.body.quantidade],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Colheita cadastrada com sucesso!!!',
                    colheitaCriado: {
                        id_colheita: result.insertId,
                        id_producao: req.body.id_producao,
                        id_pedido: req.body.id_pedido,
                        data_colheita: req.body.data_colheita,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'POST',
                            id_pedido: 'Insere Colheita',
                            url: process.env.URL_API + 'colheita'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getColheitaID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM colheita WHERE id_colheita =?',
            [req.params.id_colheita],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de colheita com este ID'
                    })
                }
                const response = {
                    colheita: {
                        id_producao: result[0].id_producao,
                        id_pedido: result[0].id_pedido,
                        data_colheita: result[0].data_colheita,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            id_pedido: 'Retorna os detalhes da Colheita',
                            url: process.env.URL_API + 'colheita'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchColheita =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE colheita SET  id_producao = ?,id_pedido= ?,data_colheita = ?, quantidade =? WHERE id_colheita =?',
            [req.body.id_producao,req.body.id_pedido,req.body.data_colheita,req.body.quantidade,req.params.id_colheita],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Colheitas atualizada com sucesso!!!',
                    colheitaAtualizado: {
                        id_producao: req.body.id_producao,
                        id_pedido: req.body.id_pedido,
                        data_colheita: req.body.id_pedido,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'PATCH',
                            id_pedido: 'Altera Colheita',
                            url: process.env.URL_API + 'colheita/' + req.body.id_colheita
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteColheita =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM colheita WHERE id_colheita =?',
            [req.params.id_colheita],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Colheita removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'Deleta uma colheita',
                        url:process.env.URL_API + 'colheita/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


