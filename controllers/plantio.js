const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getPlantio =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT A.id_plantio,A.id_secao,A.id_planta,A.descricao,A.quantidade,A.data_plantio,A.valor_custo,B.nome_planta,C.descricao_secao FROM plantio A INNER JOIN planta B ON A.id_planta = B.id_planta INNER JOIN secao C ON C.id_secao = A.id_secao',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    plantio: result.map(tp_plantio =>{
                        return {
                            id_plantio: tp_plantio.id_plantio,
                            id_secao: tp_plantio.id_secao,
                            id_planta: tp_plantio.id_planta,
                            nome_planta: tp_plantio.nome_planta,
                            descricao: tp_plantio.descricao,
                            quantidade: tp_plantio.quantidade,
                            data_plantio: tp_plantio.data_plantio,
                            valor_custo: tp_plantio.valor_custo,
                            descricao_secao: tp_plantio.descricao_secao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as plantios',
                                url: process.env.URL_API + 'plantio/' + tp_plantio.id_plantio
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
exports.postPlantio =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO plantio (id_secao,id_planta,descricao,quantidade,data_plantio,valor_custo) VALUES (?,?,?,?,?,?)',
            [req.body.id_secao,req.body.id_planta,req.body.descricao,req.body.quantidade,req.body.data_plantio,req.body.valor_custo],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Plantio inserido com sucesso!!!',
                    plantioCriado: {
                        id_secao: req.body.id_secao,
                        id_planta: req.body.id_planta,
                        descricao: req.body.descricao,
                        quantidade: req.body.quantidade,
                        data_plantio: req.body.data_plantio,
                        valor_custo: req.body.valor_custo,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Plantio',
                            url: process.env.URL_API + 'plantio'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getPlantioID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM plantio WHERE id_plantio =?',
            [req.params.id_plantio],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' N??o foi encontrado tipo de plantio com este ID'
                    })
                }
                const response = {
                    plantio: {
                        id_plantio: result[0].id_plantio,
                        id_secao: result[0].id_secao,
                        id_planta: result[0].id_planta,
                        descricao: result[0].descricao,
                        quantidade: result[0].quantidade,
                        data_plantio: result[0].data_plantio,
                        valor_custo: result[0].valor_custo,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes da Plantio',
                            url: process.env.URL_API + 'tipo_plantio'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchPlantio =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE plantio SET  id_secao = ?,id_planta = ?, descricao = ?, quantidade = ?,data_plantio = ?,valor_custo = ? WHERE id_plantio =?',
            [req.body.id_secao,req.body.id_planta,req.body.descricao,req.body.quantidade,req.body.data_plantio,req.body.valor_custo,req.params.id_plantio],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Plantio atualizado com sucesso!!!',
                    plantioAtualizado: {
                        id_secao: req.body.id_secao,
                        id_planta: req.body.id_planta,
                        descricao: req.body.descricao,
                        quantidade: req.body.quantidade,
                        data_plantio: req.body.data_plantio,
                        valor_custo: req.body.valor_custo,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Plantio',
                            url: process.env.URL_API + 'tipo_plantio/' + req.body.id_plantio
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deletePlantio =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM plantio WHERE id_plantio =?',
            [req.params.id_plantio],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Plantio removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'Deleta um plantio',
                        url:process.env.URL_API + 'tipo_plantio/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


