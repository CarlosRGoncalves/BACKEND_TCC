const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//INSERE CLIENTES 
exports.postCliente = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        conn.query(
            'INSERT INTO cliente (nome,email,telefone,cpf,endereco) VALUES (?,?,?,?,?)',
            [req.body.nome,req.body.email,req.body.telefone,req.body.cpf,req.body.endereco],
            (error, resultado, field) =>{
                conn.release();
                if(error){
                    return res.status(500).send({
                        error:error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: 'Cliente inserido com sucesso',
                    id_cliente: resultado.insertId
                });
            }
        )
    })
 
}
exports.getCliente = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM cliente',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    cliente: result.map(tp_cliente =>{
                        return {
                            id_cliente: tp_cliente.id_cliente,
                            nome: tp_cliente.nome,
                            email: tp_cliente.email,
                            telefone: tp_cliente.telefone,
                            cpf: tp_cliente.cpf,
                            endereco: tp_cliente.endereco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os tipos cliente',
                                url: 'http://localhost:3000/cliente/' + tp_cliente.id_cliente
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}
// RETORNA OS DADOS DE UM CLIENTE
exports.getCliente = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM cliente WHERE id_cliente =?',
            [req.params.id_cliente],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de planta com este ID'
                    })
                }
                const response = {
                    cliente: {
                            nome: result[0].nome,
                            email: result[0].email,
                            telefone: result[0].telefone,
                            cpf: result[0].cpf,
                            endereco: result[0].endereco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes dos Clientes',
                            url: 'http://localhost:3000/cliente'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchCliente = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE cliente SET  nome = ?, email = ?, telefone = ?, cpf =?, endereco =? WHERE id_cliente =?',
            [req.body.nome,req.body.email,req.body.telefone,req.body.cpf,req.body.endereco],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Cliente atualizado com sucesso',
                    clienteAtualizado: {
                       nome: req.body.nome,
                       email: req.body.email,
                       telefone: req.body.telefone,
                       cpf: req.body.cpf,
                       endereco:req.body.endereco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Cliente',
                            url: 'http://localhost:3000/cliente/' + req.body.id_cliente
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}
exports.deleteCliente = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM cliente WHERE id_cliente =?',
            [req.body.id_cliente],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Cliente removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descriucao: 'insere um tipo de planta',
                        url:'http://localhost:3000/cliente/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


