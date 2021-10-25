const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');


exports.postPedidoRelatorio = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'select B.nome,sum(A.quantidade) AS quantidade_total,sum(A.valor) AS soma_total from pedido A INNER JOIN produto_final B ON A.id_produto_final = B.id_produto_final where A.data BETWEEN ? AND ? GROUP BY A.id_produto_final ',
            [req.body.data_inicial,req.body.data_final],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}

                const response = {
                    quantidade: result.length,
                    pedido: result.map(tp_pedido =>{
                        return {
                            nome: tp_pedido.nome,
                            quantidade: tp_pedido.quantidade_total,
                            valor: tp_pedido.soma_total,
                            request: {
                                tipo: 'POST',
                                descricao: 'Retorno de todos os Pedidos',
                                url: process.env.URL_API + 'pedido/' 
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

exports.postPedidoRelatorio2 = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        req.body.nome_cliente = req.body.nome_cliente + '%'
        conn.query(
            'SELECT A.id_pedido,A.valor_produto_vendido,A.id_produto_final,A.id_cliente,A.status,A.descricao,A.quantidade,A.valor,A.data,B.nome,C.email, C.nome AS nome_cliente FROM pedido A INNER JOIN produto_final B ON A.id_produto_final = B.id_produto_final INNER JOIN cliente C ON C.id_cliente = A.id_cliente where C.nome LIKE ?',
            [req.body.nome_cliente],
            (error, result, field) =>{
                conn.release();
              //  console.log(error)
                if(error){return res.status(500).send({error:error,response: null});}

                const response = {
                    quantidade: result.length,
                    pedido: result.map(tp_pedido =>{
                        return {
                            id_pedido: tp_pedido.id_pedido,
                            id_produto_final: tp_pedido.id_produto_final,
                            email: tp_pedido.email,
                            nome_produto_final: tp_pedido.nome,
                            id_cliente: tp_pedido.id_cliente,
                            status: tp_pedido.status,
                            descricao: tp_pedido.descricao,
                            quantidade: tp_pedido.quantidade,
                            valor: tp_pedido.valor,
                            data: tp_pedido.data,
                            valor_produto_vendido: tp_pedido.valor_produto_vendido,
                            nome_cliente:tp_pedido.nome_cliente,
                            request: {
                                tipo: 'POST',
                                descricao: 'Retorno de todos os Pedidos',
                                url: process.env.URL_API + 'pedido/' 
                            }
                        }
                    })
                }
               // console.log(response)
                return res.status(200).send(response);
            }
        )
    });
}
//RETORNA TODOS USUARIOS
exports.getPedido = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT A.id_pedido,A.valor_produto_vendido,A.id_produto_final,A.id_cliente,A.status,A.descricao,A.quantidade,A.valor,A.data,B.nome, C.email FROM pedido A INNER JOIN produto_final B ON A.id_produto_final = B.id_produto_final INNER JOIN cliente C ON C.id_cliente = A.id_cliente ORDER BY C.email',
            (error, result, field) =>{
                conn.release();
                //console.log(result)
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    pedido: result.map(tp_pedido =>{
                        return {
                            id_pedido: tp_pedido.id_pedido,
                            id_produto_final: tp_pedido.id_produto_final,
                            email: tp_pedido.email,
                            nome_produto_final: tp_pedido.nome,
                            id_cliente: tp_pedido.id_cliente,
                            status: tp_pedido.status,
                            descricao: tp_pedido.descricao,
                            quantidade: tp_pedido.quantidade,
                            valor: tp_pedido.valor,
                            data: tp_pedido.data,
                            valor_produto_vendido: tp_pedido.valor_produto_vendido,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os Pedidos',
                                url: process.env.URL_API + 'pedido/' + tp_pedido.id_pedido
                            }
                        }
                    })
                }
               // console.log(response)
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
                            valor: result[0].valor_produto_vendido,
                            data: result[0].data,
                            valor_produto_vendido:result[0].valor_produto_vendido,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o Pedido',
                                url: process.env.URL_API + 'pedido/'
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
            conn.release();
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length==0){
                return  res.status(409).send({mensagem: 'Produto Final não encontrado não Encontrado!!!'});
            }else{  
                   // console.log(resultado)
                    const valor_produto = resultado[0].valor;
                    const valor_final = ((resultado[0].valor)*(req.body.quantidade)).toFixed(2);
                   // console.log(valor_final)
                    conn.query(
                        'INSERT INTO pedido (id_produto_final,id_cliente,status,descricao,quantidade,valor,data,valor_produto_vendido) VALUES (?,?,?,?,?,?,?,?)',
                        [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,req.body.quantidade,valor_final,req.body.data,valor_produto
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
                                mensagem: 'Pedido cadastrado com sucesso!!!',
                                pedidoCriado: {
                                    id_pedido: result.insertId,
                                    valor: valor_final
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
        conn.query('SELECT valor_produto_vendido FROM pedido WHERE id_pedido = ?', [req.params.id_pedido], (error, resultado)=>{
            conn.release();
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length==0){
                return  res.status(409).send({mensagem: 'Pedido não Encontrado!!!'});
            }else{  
                    const valor_final = (resultado[0].valor_produto_vendido)*(req.body.quantidade);
                    conn.query(
                        'UPDATE pedido SET id_produto_final = ?,id_cliente= ?,status= ?,descricao= ?,quantidade= ?,valor= ?,data= ?,valor_produto_vendido =? WHERE id_pedido =?',
                        [req.body.id_produto_final,req.body.id_cliente,req.body.status,req.body.descricao,req.body.quantidade,valor_final,req.body.data,resultado[0].valor_produto_vendido,req.params.id_pedido
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
                                mensagem: 'Pedido atualizado com sucesso!!!',
                                pedidoCriado: {
                                    id_pedido: req.params.id_pedido,
                                    valor: valor_final
                                }
                            }
                            //console.log(req.body.nome)
                            res.status(202).send({response});
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
                    mensagem: 'Pedido removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'Exclui um Pedido',
                        url:process.env.URL_API + 'pedido/'
                    }
                }
                
               return res.status(202).send({response});
            }
        )
    })
}


