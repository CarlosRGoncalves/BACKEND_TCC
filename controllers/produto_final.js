const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getProduto_final =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM produto_final',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    produto_final: result.map(tp_produto_final =>{
                        return {
                            id_produto_final: tp_produto_final.id_produto_final,
                            nome: tp_produto_final.nome,
                            descricao: tp_produto_final.descricao,
                            medida: tp_produto_final.medida,
                            valor: tp_produto_final.valor,
                            request: {
                                tipo: 'GET',
                                medida: 'Retorno de todos os produtos finais',
                                url: process.env.URL_API + 'produto_final/' + tp_produto_final.id_produto_final
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
exports.postProduto_final =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO produto_final (nome,descricao,medida,valor) VALUES (?,?,?,?)',
            [req.body.nome,req.body.descricao,req.body.medida,req.body.valor],
            (error, result, field) =>{
                conn.release();
                console.log(error)
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Produto Final cadastrado com sucesso!!!',
                    produto_finalCriado: {
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        medida: req.body.medida,
                        valor: req.body.valor,
                        request: {
                            tipo: 'POST',
                            medida: 'Insere Produto_final',
                            url: process.env.URL_API + 'produto_final'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getProduto_finalID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM produto_final WHERE id_produto_final =?',
            [req.params.id_produto_final],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de Produto Final com este ID!!!'
                    })
                }
                const response = {
                    produto_final: {
                        nome: result[0].nome,
                        descricao: result[0].descricao,
                        medida: result[0].medida,
                        valor: result[0].valor,
                        request: {
                            tipo: 'GET',
                            medida: 'Retorna os detalhes da Produto Final',
                            url: process.env.URL_API + 'produto_final'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchProduto_final =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE produto_final SET  nome = ?, descricao = ?,medida= ?,valor = ? WHERE id_produto_final =?',
            [req.body.nome,req.body.descricao,req.body.medida,req.body.valor,req.params.id_produto_final],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Produto Final atualizado com sucesso!!!',
                    produto_finalAtualizado: {
                        nome: req.body.nome,
                        descricao: req.body.descricao,
                        medida: req.body.medida,
                        valor: req.body.valor,
                        request: {
                            tipo: 'PATCH',
                            medida: 'Altera Produto_final',
                            url: process.env.URL_API + 'produto_final/' + req.body.id_produto_final
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteProduto_final =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM produto_final WHERE id_produto_final =?',
            [req.params.id_produto_final],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Produto Final removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'Deleta uma produto_final',
                        url:process.env.URL_API + 'produto_final/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


