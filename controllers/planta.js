const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getPlanta =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT A.id_planta,A.id_tipo_planta,B.nome_tipo_planta,A.nome_planta,A.descricao,A.epoca_plantio,A.forma_plantio,A.tempo_colheita FROM planta A INNER JOIN tipo_planta B ON A.id_tipo_planta = B.id_tipo_planta ',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
              //  console.log(result)
                const response = {
                    quantidade: result.length,
                    planta: result.map(tp_planta =>{
                        console.log(tp_planta)
                        return {
                            id_planta: tp_planta.id_planta,
                            nome_tipo_planta: tp_planta.nome_tipo_planta,
                            id_tipo_planta: tp_planta.id_tipo_planta,
                            nome_planta: tp_planta.nome_planta,
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
            'INSERT INTO planta (id_tipo_planta,nome_planta,descricao,epoca_plantio,forma_plantio,tempo_colheita) VALUES (?,?,?,?,?,?)',
            [req.body.id_tipo_planta,req.body.nome_planta,req.body.descricao,req.body.epoca_plantio,req.body.forma_plantio,req.body.tempo_colheita],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Planta cadastrada com sucesso!!!',
                    plantaCriado: {
                        id_tipo_planta: req.body.id_tipo_planta,
                        nome_planta: req.body.nome_planta,
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
exports.getPlantaID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM planta WHERE id_planta =?',
            [req.params.id_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.status(404).send({
                        mensagem:' Não foi encontrado tipo de planta com este ID'
                    })
                }
                const response = {
                    planta: {
                        id_planta: result[0].id_planta,
                        id_tipo_planta: result[0].id_tipo_planta,
                        nome_planta: result[0].nome_planta,
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
            'UPDATE planta SET  id_tipo_planta = ?,nome_planta = ?,descricao = ?,epoca_plantio = ?, forma_plantio = ?, tempo_colheita = ? WHERE id_planta =?',
            [req.body.id_tipo_planta, req.body.nome_planta,req.body.descricao,req.body.epoca_plantio,req.body.forma_plantio,req.body.tempo_colheita,req.params.id_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Planta atualizada com sucesso!!!',
                    plantaAtualizado: {
                        id_tipo_planta: req.body.id_tipo_planta,
                        nome_planta: req.body.nome_planta,
                        descricao: req.body.descricao,
                        epoca_plantio: req.body.epoca_plantio,
                        forma_plantio: req.body.forma_plantio,
                        tempo_colheita: req.body.tempo_colheita,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Planta',
                            url: 'http://localhost:3006/planta/' + req.body.id_planta
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
            [req.params.id_planta],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Planta removida com sucesso!!!',
                    request:{
                        tipo: 'POST',
                        descricao: 'insere um tipo de planta',
                        url:'http://localhost:3006/tipo_planta/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


