const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS AS PLANTAS
exports.getProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT A.id_producao,A.id_insumo,A.id_plantio, A.quantidade_producao,A.id_unidade_medida,data_producao,A.id_p_doenca, A.adubacao, A.defensivo, A.data_defensivo,A.data_adubacao,A.qtd_adubacao,A.qtd_defensivo,B.nome_insumo, C.nome_p_doenca,D.nome_unidade_medida  FROM producao A INNER JOIN insumo B ON A.id_insumo = B.id_insumo LEFT JOIN pragas_doenca C ON C.id_p_doenca = A.id_p_doenca LEFT JOIN unidade_medida D ON D.id_unidade_medida = A.id_unidade_medida',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    producao: result.map(tp_producao =>{
                        return {
                            id_producao: tp_producao.id_producao,
                            id_insumo: tp_producao.id_insumo,
                            id_plantio: tp_producao.id_plantio,
                            id_p_doenca: tp_producao.id_p_doenca,
                            nome_insumo:tp_producao.nome_insumo,
                            nome_p_doenca:tp_producao.nome_p_doenca,
                            adubacao: tp_producao.adubacao,
                            defensivo: tp_producao.defensivo,
                            data_defensivo: tp_producao.data_defensivo,
                            data_adubacao: tp_producao.data_adubacao,
                            qtd_adubacao: tp_producao.qtd_adubacao,
                            qtd_defensivo: tp_producao.qtd_defensivo,
                            unidade_medida: tp_producao.id_unidade_medida,
                            quantidade_producao: tp_producao.quantidade_producao,
                            data_producao: tp_producao.data_producao,
                            nome_unidade_medida:tp_producao.nome_unidade_medida,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as producoes',
                                url: process.env.URL_API + 'producao/' + tp_producao.id_producao
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });
}
exports.postProducaoRelatorio =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'SELECT A.id_producao,A.id_insumo,A.id_plantio, E.nome_unidade_medida,A.quantidade_producao,A.data_producao,A.id_p_doenca, A.adubacao, A.defensivo, A.data_defensivo,A.data_adubacao,A.qtd_adubacao,A.qtd_defensivo,B.data_plantio,C.nome_insumo, D.nome_p_doenca  FROM producao A INNER JOIN plantio B ON A.id_plantio = B.id_plantio INNER JOIN insumo c On A.id_insumo = C.id_insumo LEFT JOIN pragas_doenca D ON A.id_p_doenca = D.id_p_doenca LEFT JOIN unidade_medida E ON E.id_unidade_medida = A.id_unidade_medida where A.data_producao BETWEEN ? AND ?',
            [req.body.data_inicial,req.body.data_final],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    producao: result.map(tp_producao =>{
                        return {
                            id_producao: tp_producao.id_producao,
                            id_insumo: tp_producao.id_insumo,
                            id_plantio: tp_producao.id_plantio,
                            id_p_doenca: tp_producao.id_p_doenca,
                            nome_insumo:tp_producao.nome_insumo,
                            nome_p_doenca:tp_producao.nome_p_doenca,
                            data_plantio:tp_producao.data_plantio,
                            adubacao: tp_producao.adubacao,
                            defensivo: tp_producao.defensivo,
                            data_defensivo: tp_producao.data_defensivo,
                            data_adubacao: tp_producao.data_adubacao,
                            qtd_adubacao: tp_producao.qtd_adubacao,
                            qtd_defensivo: tp_producao.qtd_defensivo,
                            unidade_medida: tp_producao.nome_unidade_medida,
                            quantidade_producao: tp_producao.quantidade_producao,
                            data_producao: tp_producao.data_producao,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos as producoes',
                                url: process.env.URL_API + 'producao/' + tp_producao.id_producao
                            }
                        }
                    })
                }
               // console.log(response)
                return res.status(200).send(response);
            }
        )
    })
}


//INSERE PLANTA 
exports.postProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        if(req.body.id_p_doenca ==''){
            req.body.id_p_doenca= null
        }

       // console.log(req.body.id_p_doenca)
        conn.query(
            'INSERT INTO producao (id_insumo,id_plantio,id_p_doenca,data_producao,id_unidade_medida,quantidade_producao) VALUES (?,?,?,?,?,?)',
            [req.body.id_insumo,req.body.id_plantio,req.body.id_p_doenca,req.body.data_producao,req.body.id_unidade_medida,req.body.quantidade_producao],
            (error, result, field) =>{
                conn.release();
                //console.log(error)
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Produção cadastrada com sucesso!!!',
                    producaoCriado: {
                        id_producao: result.insertId,
                        id_insumo: req.body.id_insumo,
                        id_plantio: req.body.id_plantio,
                        id_p_doenca: req.body.id_p_doenca,
                        adubacao: req.body.adubacao,
                        defensivo: req.body.defensivo,
                        data_defensivo: req.body.data_defensivo,
                        data_adubacao: req.body.data_adubacao,
                        qtd_adubacao: req.body.qtd_adubacao,
                        qtd_defensivo: req.body.qtd_defensivo,
                        data_producao: req.body.data_producao,
                        id_unidade_medida: req.body.id_unidade_medida,
                        quantidade_producao: req.body.quantidade_producao,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere Producao',
                            url: process.env.URL_API + 'producao'
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
                //console.log(result)
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.status(404).send({
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
                        id_unidade_medida: result[0].id_unidade_medida,
                        quantidade_producao: result[0].quantidade_producao,
                        data_producao: result[0].data_producao,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes da Produção!!!',
                            url: process.env.URL_API + 'producao'
                        }
                    }
                }
               // console.log(response)
               return res.status(200).send({response});
            }
        )
    });
}


exports.patchProducao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        if(req.body.id_p_doenca ==''){
            req.body.id_p_doenca= null
        }
        conn.query(
            'UPDATE producao SET  id_insumo = ?,id_plantio= ?,id_p_doenca= ?,data_producao=?,id_unidade_medida=?,quantidade_producao=? WHERE id_producao =?',
            [req.body.id_insumo,req.body.id_plantio,req.body.id_p_doenca,req.body.data_producao,req.body.id_unidade_medida,req.body.quantidade_producao,req.params.id_producao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Produção atualizada com sucesso!!!',
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
                            url: process.env.URL_API + 'tipo_producao/' + req.body.id_producao
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
                    mensagem: 'Produção removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'Deleta uma producao!!!',
                        url:process.env.URL_API + 'tipo_producao/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}


