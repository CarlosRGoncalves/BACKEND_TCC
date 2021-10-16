const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');
//RETORNA TODOS USUARIOS
exports.getUsuario = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM usuario',
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    quantidade: result.length,
                    usuario: result.map(tp_usuario =>{
                        return {
                            id_usuario: tp_usuario.id_usuario,
                            nome: tp_usuario.nome,
                            email: tp_usuario.email,
                            telefone: tp_usuario.telefone,
                            tipo_usuario: tp_usuario.tipo_usuario,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno de todos os Usuarios',
                                url: 'http://localhost:3006/usuario/' + tp_usuario.id_usuario
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
exports.getUsuarioID = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query(
            'SELECT * FROM usuario where id_usuario = ?',
            [req.params.id_usuario],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    usuario: {                      
                            nome: result[0].nome,
                            email: result[0].email,
                            telefone: result[0].telefone,
                            tipo_usuario: result[0].tipo_usuario,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o Usuario',
                                url: 'http://localhost:3006/usuario/'
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
exports.postUsuarioCad = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});}
        conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error, resultado)=>{
            conn.release();
            if(error){return res.status(500).send({error:error,response: null});}
            if(resultado.length>0){
            return  res.status(409).send({mensagem: 'Usuário com esse E-mail já Cadastrado!!!'});
            }else{
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if(errBcrypt){return res.status(500).send({error:errBcrypt});}
                    conn.query(
                        'INSERT INTO usuario (nome,email,telefone,tipo_usuario,senha) VALUES (?,?,?,?,?)',
                        [req.body.nome,req.body.email,req.body.telefone,req.body.tipo_usuario,hash],
                        (error, result, field) =>{
                            conn.release();
                            if(error){
                                return res.status(500).send({
                                    error:error,
                                    response: null
                                });
                            }
                            response = {
                                mensagem: 'Usuario criado com sucesso!!!',
                                usuarioCriado: {
                                   id_usuario: result.insertId,
                                   email: req.body.email
                                }
                            }
                            console.log(req.body.nome)
                            res.status(201).send({response});
                    })
                })
            }
        })
    })
}

exports.postUsuario = (req, res, next) =>{
  //  console.log("SDFSDSD");
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error});}
        const query = 'SELECT * FROM usuario WHERE email = ?';
    
        conn.query(query, [req.body.email], (error, resultado, fields) =>{
            conn.release();
            if(error){return res.status(500).send({error:error});}
            if(resultado.length<1){
               // console.log('aquidd')
                return res.status(401).send({mensagem: 'Falha na autenticação'})
            }
            bcrypt.compare(req.body.senha, resultado[0].senha,(err, resultado_senha)=>{
                if(err){
                    //console.log('aqui1')
                    return res.status(401).send({ mensagem: 'Falha na autenticação senha' })
                }
                if(resultado_senha){
                    const token = jwt.sign({
                        id_usuario: resultado[0].id_usuario,
                        nome: resultado[0].nome,
                        email: resultado[0].email,
                        tipo_usuario: resultado[0].tipo_usuario
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

exports.patchUsuario =(req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
            if(error){return res.status(500).send({error:error,response: null});
            }
            conn.query(
                'UPDATE usuario SET  nome = ?, email = ?,telefone = ?, tipo_usuario = ?, senha = ?  WHERE id_usuario =?',
                [req.body.nome,req.body.email,req.body.telefone,req.body.tipo_usuario,hash,req.params.id_usuario],
                (error, result, field) =>{
                    conn.release();
                    if(error){return res.status(500).send({error:error,response: null});}
                    const response = {
                        mensagem: 'Usuario atualizado com sucesso!!!',
                        
                    }
                    return res.status(202).send({response});
                }
            )
        })
    })
}

exports.deleteUsuario = (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error:error,response: null});
        }
        conn.query(
            'DELETE FROM usuario WHERE id_usuario =?',
            [req.params.id_usuario],
            (error, result, field) =>{
                conn.release();
                if(error){return res.status(500).send({error:error,response: null});}
                const response = {
                    mensagem: 'Usuario removido com sucesso!!!',
                    request:{
                        tipo: 'DELETE',
                        descricao: 'Exclui um Usuário',
                        url:'http://localhost:3006/usuario/'
                    }
                }
                
               return res.status(202).send({response});
            }
        )
    })
}


