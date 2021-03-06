const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getPragas_doenca =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM pragas_doenca',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    pragas_doenca: result.map(tp_pragas_doenca =>{
                        return {
                            id_p_doenca: tp_pragas_doenca.id_p_doenca,
                            nome_p_doenca: tp_pragas_doenca.nome_p_doenca,
                            descricao: tp_pragas_doenca.descricao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as pragas e doencas',
                                url: process.env.URL_API + 'pragas_doenca/' + tp_pragas_doenca.id_p_doenca
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
exports.postPragas_doenca =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO pragas_doenca (nome_p_doenca,descricao) VALUES (?,?)',
            [req.body.nome_p_doenca,req.body.descricao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Pragas/Doencas cadastradas com sucesso!!!',
                    pragas_doencaCriado: {
                        nome_p_doenca: req.body.nome_p_doenca,
                        descricao: req.body.descricao,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Pragas e doenca',
                            url: process.env.URL_API + 'pragas_doenca'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getPragas_doencaID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM pragas_doenca WHERE id_p_doenca =?',
            [req.params.id_p_doenca],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.status(404).send({
                        mensagem:' N??o foi encontrado tipo de pragas_doenca com este ID'
                    })
                }
                const response = {
                    pragas_doenca: {
                        id_p_doenca: result[0].id_p_doenca,
                        nome_p_doenca: result[0].nome_p_doenca,
                        descricao: result[0].descricao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes da Pragas e doencas',
                            url: process.env.URL_API + 'pragas_doenca'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchPragas_doenca =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE pragas_doenca SET  nome_p_doenca = ?,descricao= ? WHERE id_p_doenca =?',
            [req.body.nome_p_doenca,req.body.descricao,req.params.id_p_doenca],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Pragas/Doen??as atualizado com sucesso!!!',
                    pragas_doencaAtualizado: {
                        id_p_doenca: req.body.id_p_doenca,
                        nome_p_doenca: req.body.nome_p_doenca,
                        descricao: req.body.descricao,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Pragas_doenca',
                            url: process.env.URL_API + 'pragas_doenca/' + req.body.id_p_doenca
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deletePragas_doenca =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM pragas_doenca WHERE id_p_doenca =?',
            [req.params.id_p_doenca],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Pragas/Doen??as removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'insere uma pragas_doenca',
                        url:process.env.URL_API + 'pragas_doenca/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


