async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:utfpr@localhost:3306/mydb");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}
//connect();
/*const conn = await connect();
    const sql = 'INSERT INTO clientes(nome,idade,uf) VALUES (?,?,?);';
    const values = [customer.nome, customer.idade, customer.uf];
    return await conn.query(sql, values);*/
/*async function selectCustomers(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM usuario;');
    return rows;
}*/
 
module.exports = {connect}//selectCustomers}