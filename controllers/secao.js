const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//RETORNA TODOS OD TIPOS DE PLANTAS
exports.getSecao = (req, res, next) =>{
    console.log("ENTROU")
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM secao a INNER JOIN usuario b ON A.id_usuario = B.id_usuario',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    secao: result.map(tp_secao =>{
                        return {
                            id_secao: tp_secao.id_secao,
                            id_usuario: tp_secao.id_usuario,
                            descricao_secao: tp_secao.descricao_secao,
                            area: tp_secao.area,
                            nome: tp_secao.nome,
                            request: {
                                tipo: 'GET',
                                descricao_secao: 'Retorno de todos os tipos de secões',
                                url: process.env.URL_API + 'secao/' + tp_secao.id_secao
                            }
                        }
                    })
                }
                console.log(response);
                
                return res.status(200).send(response);
            }
        )
    });
}

//INSERE SECAO 
exports.postSecao = (req, res, next) =>{
    console.log(req.usuario)
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'INSERT INTO secao (id_usuario,descricao_secao,area) VALUES (?,?,?)',
            [req.body.id_usuario,req.body.descricao_secao,req.body.area],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Seção cadastrada com sucesso!!!',
                    secaoCriado: {
                        usuario: req.body.id_usuario,
                        descricao_secao: req.body.descricao_secao,
                        area: req.body.area,
                        request: {
                            tipo: 'POST',
                            descricao_secao: 'Insere Secao',
                            url: process.env.URL_API + 'secao'
                        }
                    }
                }
               return res.status(201).send({response});
            }
        )
    })
}
// RETORNA OS DADOS DE UM TIPO DE PLANTA
exports.getSecaoID = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM secao WHERE id_secao =?',
            [req.params.id_secao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                if(result.length ==0){
                    return res.status(404).send({
                        mensagem:' Não foi encontrado Secaocom este ID'
                    })
                }
                const response = {
                    secao: {
                        id_usuario: result[0].id_usuario,
                        descricao_secao: result[0].descricao_secao,
                        area: result[0].area,
                        request: {
                            tipo: 'GET',
                            descricao_secao: 'Retorna os detalhes da Secao',
                            url: process.env.URL_API + 'Secao'
                        }
                    }
                }
               return res.status(200).send(response);
            }
        )
    });
}


exports.patchSecao =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'UPDATE secao SET  descricao_secao = ?, area = ? WHERE id_secao =?',
            [req.body.descricao_secao,req.body.area,req.params.id_secao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Seção atualizada com sucesso!!!',
                    SecaoAtualizado: {
                        id_usuario: req.body.id_usuario,
                        descricao_secao: req.body.descricao_secao,
                        area: req.body.area,
                        request: {
                            tipo: 'PATCH',
                            descricao_secao: 'Altera Secao',
                            url: process.env.URL_API + 'secao/' + req.body.id_secao
                        }
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
}

exports.deleteSecao = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM secao WHERE id_secao =?',
            [req.params.id_secao],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Seção removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descriucao: 'Deleta um Secao',
                        url:process.env.URL_API + 'secao/'
                    }
                }
               return res.status(202).send({response});
            }
        )
    })
}

