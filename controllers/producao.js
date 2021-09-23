const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM producao',
            (error, result, field) =>{
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    producao: result.map(tp_producao =>{
                        return {
                            id_producao: tp_producao.id_producao,
                            id_insumo: tp_producao.id_insumo,
                            id_plantio: tp_producao.id_plantio,
                            id_p_doenca: tp_producao.id_p_doenca,
                            adubacao: tp_producao.adubacao,
                            defensivo: tp_producao.defensivo,
                            data_defensivo: tp_producao.data_defensivo,
                            data_adubacao: tp_producao.data_adubacao,
                            qtd_adubacao: tp_producao.qtd_adubacao,
                            qtd_defensivo: tp_producao.qtd_defensivo,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as producoes',
                                url: 'http://localhost:3006/producao/' + tp_producao.id_producao
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
exports.postProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO producao (id_insumo,id_plantio,id_p_doenca,adubacao,defensivo,data_defensivo,data_adubacao,qtd_adubacao,qtd_defensivo) VALUES (?,?,?,?,?,?,?,?,?)',
            [req.body.id_insumo,req.body.id_plantio,req.body.id_p_doenca,req.body.adubacao,req.body.defensivo,req.body.data_defensivo,req.body.data_adubacao,req.body.qtd_adubacao,req.body.qtd_defensivo],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Producao inserido com sucesso',
                    producaoCriado: {
                        id_insumo: req.body.id_insumo,
                        id_plantio: req.body.id_plantio,
                        id_p_doenca: req.body.id_p_doenca,
                        adubacao: req.body.adubacao,
                        defensivo: req.body.defensivo,
                        data_defensivo: req.body.data_defensivo,
                        data_adubacao: req.body.data_adubacao,
                        qtd_adubacao: req.body.qtd_adubacao,
                        qtd_defensivo: req.body.qtd_defensivo,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Producao',
                            url: 'http://localhost:3006/producao'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DA PLANTA
exports.getProducaoID =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM producao WHERE id_producao =?',
            [req.params.id_producao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.length(404).send({
                        mensagem:' Não foi encontrado tipo de producao com este ID'
                    })
                }
                const response = {
                    producao: {
                        id_insumo: result[0].id_insumo,
                        id_plantio: result[0].id_plantio,
                        id_p_doenca: result[0].id_p_doenca,
                        adubacao: result[0].adubacao,
                        defensivo: result[0].defensivo,
                        data_defensivo: result[0].data_defensivo,
                        data_adubacao: result[0].data_adubacao,
                        qtd_adubacao: result[0].qtd_adubacao,
                        qtd_defensivo: result[0].qtd_defensivo,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes da Producao',
                            url: 'http://localhost:3006/producao'
                        }
                    }
                }
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE producao SET  id_insumo = ?,id_plantio= ?,id_p_doenca= ?,adubacao= ?,defensivo= ?,data_defensivo= ?,data_adubacao= ?,qtd_adubacao= ?,qtd_defensivo= ? WHERE id_producao =?',
            [req.body.id_insumo,req.body.id_plantio,req.body.id_p_doenca,req.body.adubacao,req.body.defensivo,req.body.data_defensivo,req.body.data_adubacao,req.body.qtd_adubacao,req.body.qtd_defensivo,req.params.id_producao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Producao atualizado com sucesso',
                    producaoAtualizado: {
                        id_insumo: req.body.id_insumo,
                        id_plantio: req.body.id_plantio,
                        id_p_doenca: req.body.id_p_doenca,
                        adubacao: req.body.adubacao,
                        defensivo: req.body.defensivo,
                        data_defensivo: req.body.data_defensivo,
                        data_adubacao: req.body.data_adubacao,
                        qtd_adubacao: req.body.qtd_adubacao,
                        qtd_defensivo: req.body.qtd_defensivo,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera Producao',
                            url: 'http://localhost:3006/tipo_producao/' + req.body.id_producao
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM producao WHERE id_producao =?',
            [req.params.id_producao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Producao removido com sucesso',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'insere uma producao',
                        url:'http://localhost:3006/tipo_producao/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


