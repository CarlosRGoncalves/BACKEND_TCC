const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getInsumo =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM insumo',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    insumo: result.map(tp_insumo =>{
                        return {
                            id_insumo: tp_insumo.id_insumo,
                            id_fornecedor: tp_insumo.id_fornecedor,
                            nome: tp_insumo.nome,
                            descricao: tp_insumo.descricao,
                            quantidade: tp_insumo.quantidade,
                            data: tp_insumo.data,
                            valor: tp_insumo.valor,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos Insumos',
                                url: 'http://localhost:3006/insumo/' + tp_insumo.id_insumo
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
exports.postInsumo =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO insumo (id_fornecedor,nome,descricao,quantidade,data,valor) VALUES (?,?,?,?,?,?)',
            [req.body.id_fornecedor,req.body.nome,req.body.descricao,req.body.quantidade,req.body.data,req.body.valor],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Insumo cadastrado com sucesso!!!',
                    insumoCriado: {
                        id_insumo: req.body.id_insumo,
                        id_fornecedor: req.body.id_fornecedor,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        quantidade: req.body.quantidade,
                        data: req.body.data,
                        valor: req.body.valor,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Insumos',
                            url: 'http://localhost:3006/insumo'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getInsumoID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM insumo WHERE id_insumo =?',
            [req.params.id_insumo],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado Insumo com este ID!!!'
                    })
                }
                const response = {
                    insumo: {
                        id_insumo: result[0].id_insumo,
                        id_fornecedor: result[0].id_fornecedor,
                        nome: result[0].nome,
                        descricao: result[0].descricao,
                        quantidade: result[0].quantidade,
                        data: result[0].data,
                        valor: result[0].valor,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes do Insumo',
                            url: 'http://localhost:3006/insumo'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchInsumo =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE insumo SET  id_fornecedor = ?,nome = ?,descricao= ?, quantidade = ?, data =?, valor =? WHERE id_insumo =?',
            [req.body.id_fornecedor,req.body.nome,req.body.descricao,req.body.quantidade,req.body.data,req.body.valor,req.params.id_insumo],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Insumo atualizado com sucesso!!!',
                    insumoAtualizado: {
                        id_insumo: req.body.id_insumo,
                        id_fornecedor: req.body.id_fornecedor,
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        quantidade: req.body.quantidade,
                        data: req.body.data,
                        valor: req.body.valor,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Insumo',
                            url: 'http://localhost:3006/insumo/' + req.body.id_insumo
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteInsumo =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM insumo WHERE id_insumo =?',
            [req.params.id_insumo],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Insumo removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'insere uma insumo',
                        url:'http://localhost:3006/insumo/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


