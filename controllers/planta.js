const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getPlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM planta',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    planta: result.map(tp_planta =>{
                        return {
                            id_planta: tp_planta.id_planta,
                            id_tipo_planta: tp_planta.id_tipo_planta,
                            descricao: tp_planta.descricao,
                            epoca_plantio: tp_planta.epoca_plantio,
                            forma_plantio: tp_planta.forma_plantio,
                            tempo_colheita: tp_planta.tempo_colheita,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as plantas',
                                url: 'http://localhost:3006/planta/' + tp_planta.id_planta
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
exports.postPlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO planta (id_tipo_planta,descricao,epoca_plantio,forma_plantio,tempo_colheita) VALUES (?,?,?,?,?)',
            [req.body.id_tipo_planta,req.body.descricao,req.body.epoca_plantio,req.body.forma_plantio,req.body.tempo_colheita],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta inserido com sucesso',
                    plantaCriado: {
                        id_planta: req.body.id_planta,
                        id_tipo_planta: req.body.id_tipo_planta,
                        descricao: req.body.descricao,
                        epoca_plantio: req.body.epoca_plantio,
                        forma_plantio: req.body.forma_plantio,
                        tempo_colheita: req.body.tempo_colheita,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Planta',
                            url: 'http://localhost:3006/planta'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getPlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM planta WHERE id_planta =?',
            [req.params.id_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de planta com este ID'
                    })
                }
                const response = {
                    tipo_planta: {
                        id_planta: result[0].id_planta,
                        id_tipo_planta: result[0].id_tipo_planta,
                        descricao: result[0].descricao,
                        epoca_plantio: result[0].epoca_plantio,
                        forma_plantio: result[0].forma_plantio,
                        tempo_colheita: result[0].tempo_colheita,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes da Planta',
                            url: 'http://localhost:3006/tipo_planta'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchPlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE planta SET  descricao = ?,epoca_plantio = ?, forma_plantio = ?, tempo_colheita = ? WHERE id_planta =?',
            [req.body.nome,req.body.descricao,req.body.id_tipo_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta atualizado com sucesso',
                    plantaAtualizado: {
                        id_planta: req.body.id_planta,
                        id_tipo_planta: req.body.id_tipo_planta,
                        descricao: req.body.descricao,
                        epoca_plantio: req.body.epoca_plantio,
                        forma_plantio: req.body.forma_plantio,
                        tempo_colheita: req.body.tempo_colheita,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Tipo de Planta',
                            url: 'http://localhost:3006/tipo_planta/' + req.body.id_tipo_planta
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deletePlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM planta WHERE id_planta =?',
            [req.body.id_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Tipo de planta removido com sucesso',
                    request:{
                        tipo: 'POST',
                        descriucao: 'insere um tipo de planta',
                        url:'http://localhost:3006/tipo_planta/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


