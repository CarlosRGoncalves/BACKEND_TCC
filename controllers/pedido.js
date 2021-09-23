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
                            id_produto_final: result[0].id_produto_final,
                            id_cliente: result[0].id_cliente,
                            status: result[0].status,
                            descricao: result[0].descricao,
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
exports.postPedidoCad = (req, res, next) =>{
    login.obrigatorio
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query('SELECT * FROM pedido WHERE id_cliente = ?', [req.body.id_cliente], (error, resultado)=>{
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length>0){
                res.status(409).send({mensage: 'Usuário já Cadastrado'});
            }else{
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if(errBcrypt){return res.status(500).send({error:errBcrypt});}
                    conn.query(
                        'INSERT INTO pedido (id_produto_final,id_cliente,status,descricao,senha) VALUES (?,?,?,?,?)',
                        [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,hash],
                        (error, resultado, field) =>{
                            conn.release();
                            if(error){
                                return res.status(500).send({
                                    error:error,
                                    response: null
                                });
                            }
                            response = {
                                mensagem: 'Pedido criado com sucesso',
                                pedidoCriado: {
                                   id_pedido: resultado.insertId,
                                   id_cliente: req.body.id_cliente
                                }
                            }
                            console.log(req.body.id_produto_final)
                            res.status(201).send({response});
                    })
                })
            }
        })
    })
}

exports.postPedido = (req, res, next) =>{
  //  console.log("SDFSDSD");
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error});}
        const query = 'SELECT * FROM pedido WHERE id_cliente = ?';
    
        conn.query(query, [req.body.id_cliente], (error, resultado, fields) =>{
            conn.release();
            if(error){return res.status(500).send({error:error});}
            if(resultado.length<1){
               // console.log('aquidd')
                return res.status(401).send({mensagem: 'Falha na autenticação'})
            }
            bcrypt.compare(req.body.senha, resultado[0].senha,(err, resultado_senha)=>{
                if(err){
                    //console.log('aqui1')
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                if(resultado_senha){
                    const token = jwt.sign({
                        id_pedido: resultado[0].id_pedido,
                        id_produto_final: resultado[0].id_produto_final,
                        id_cliente: resultado[0].id_cliente,
                        descricao: resultado[0].descricao
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
                    //console.log('Sucesso')
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }
                //console.log('aqui')
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            })
        })
      
    })
}

exports.patchPedido =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
            if(error){return res.status(500).send({error:error,response: null});
            }
            conn.query(
                'UPDATE pedido SET  id_produto_final = ?, id_cliente = ?,status = ?, descricao = ?, senha = ?  WHERE id_pedido =?',
                [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,hash,req.params.id_pedido],
                (error, result, field) =>{
                    conn.release();
                    if(error){return res.status(500).send({error:error,response: null});}
                    const response = {
                        mensagem: 'Pedido atualizado com sucesso',
                        
                    }
                    return res.status(200).send({response});
                }
            )
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


