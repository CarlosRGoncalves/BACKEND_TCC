const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');
//RETORNA TODOS USUARIOS
exports.getPedido = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM pedido',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    pedido: result.map(tp_pedido =>{
                        return {
                            id_pedido: tp_pedido.id_pedido,
                            id_produto_final: tp_pedido.id_produto_final,
                            id_cliente: tp_pedido.id_cliente,
                            status: tp_pedido.status,
                            descricao: tp_pedido.descricao,
                            quantidade: tp_pedido.quantidade,
                            valor: tp_pedido.valor,
                            data: tp_pedido.data,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os Pedidos',
                                url: 'http://localhost:3006/pedido/' + tp_pedido.id_pedido
                            }
                        }
                    })
                }
                //console.log(response)
                return res.status(200).send(response);
            }
        )
    });
}
exports.getPedidoID = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM pedido where id_pedido = ?',
            [req.params.id_pedido],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    pedido: {                      
                            id_pedido: result[0].id_pedido,
                            id_produto_final: result[0].id_produto_final,
                            id_cliente: result[0].id_cliente,
                            status: result[0].status,
                            descricao: result[0].descricao,
                            quantidade: result[0].quantidade,
                            valor: result[0].valor,
                            data: result[0].data,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o Pedido',
                                url: 'http://localhost:3006/pedido/'
                            }
                        
                    }
                }
                //console.log(response)
                return res.status(200).send(response);
            }
        )
    });
}


//INSERE USUARIOS 
exports.postPedido = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query('SELECT * FROM produto_final WHERE id_produto_final = ?', [req.body.id_produto_final], (error, resultado)=>{
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length==0){
            return  res.status(409).send({mensagem: 'Produto não Encontrado'});
            }else{  
                console.log("ENTROU")
                    console.log(resultado)
                    const valor_final = (resultado[0].valor)*(req.body.quantidade);
                    console.log(valor_final)
                    conn.query(
                        'INSERT INTO pedido (id_produto_final,id_cliente,status,descricao,quantidade,valor,data) VALUES (?,?,?,?,?,?,?)',
                        [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,req.body.quantidade,valor_final,req.body.data
                        ],
                        (error, result, field) =>{
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
                                   id_usuario: result.insertId,
                                   id_cliente: req.body.id_cliente
                                }
                            }
                            //console.log(req.body.nome)
                            res.status(201).send({response});
                    })
               
            }
        })
    })
}


exports.patchPedido =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query('SELECT valor FROM produto_final WHERE id_produto_final = ?', [req.body.id_produto_final], (error, resultado)=>{
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length>0){
            return  res.status(409).send({mensagem: 'Produto não Encontrado'});
            }else{  
                    const valor_final = (resultado[0].valor)*(req.body.quantidade);
                    conn.query(
                        'UPDATE pedido SET id_produto_final,id_cliente,status,descricao,quantidade,valor,data WHERE id_pedido =?',
                        [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,req.body.quantidade,valor_final,req.body.data
                        ],
                        (error, result, field) =>{
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
                                   id_usuario: result.insertId,
                                   id_cliente: req.body.id_cliente
                                }
                            }
                            //console.log(req.body.nome)
                            res.status(201).send({response});
                    })
               
            }
        })
    })
}

exports.deletePedido = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM pedido WHERE id_pedido =?',
            [req.params.id_pedido],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'Exclui um Usuário',
                        url:'http://localhost:3006/pedido/'
                    }
                }
                
               return res.status(202).send({response});
            }
        )
    })
}


