const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getFornecedor =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM fornecedor',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    fornecedor: result.map(tp_fornecedor =>{
                        return {
                            id_fornecedor: tp_fornecedor.id_fornecedor,
                            nome: tp_fornecedor.nome,
                            cnpj: tp_fornecedor.cnpj,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos fornecedores',
                                url: 'http://localhost:3006/fornecedor/' + tp_fornecedor.id_fornecedor
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
exports.postFornecedor =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO fornecedor (nome,cnpj) VALUES (?,?)',
            [req.body.nome,req.body.cnpj],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Fornecedor cadastrado com sucesso!!!',
                    fornecedorCriado: {
                        nome: req.body.nome,
                        cnpj: req.body.cnpj,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Fornecedor',
                            url: 'http://localhost:3006/fornecedor'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getFornecedorID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM fornecedor WHERE id_fornecedor =?',
            [req.params.id_fornecedor],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de fornecedor com este ID!!!'
                    })
                }
                const response = {
                    fornecedor: {
                        id_fornecedor: result[0].id_fornecedor,
                        nome: result[0].nome,
                        cnpj: result[0].cnpj,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes dos Fornecedores',
                            url: 'http://localhost:3006/fornecedor'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchFornecedor =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE fornecedor SET  nome = ?,cnpj= ? WHERE id_fornecedor =?',
            [req.body.nome,req.body.cnpj,req.params.id_fornecedor],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Fornecedor atualizado com sucesso!!!',
                    fornecedorAtualizado: {
                        id_fornecedor: req.body.id_fornecedor,
                        nome: req.body.nome,
                        cnpj: req.body.cnpj,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Fornecedor',
                            url: 'http://localhost:3006/fornecedor/' + req.body.id_fornecedor
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteFornecedor =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM fornecedor WHERE id_fornecedor =?',
            [req.params.id_fornecedor],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Fornecedor removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'insere uma fornecedor',
                        url:'http://localhost:3006/fornecedor/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


