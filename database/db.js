const mysql = require('mysql');

const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
})

conexion.connect((error)=>{
    if(error){
        console.log('El error de conexión es: ' + error)
        return
    }
    console.log('Conexión exitosa con la base de datos MYSQL')
})

module.exports = conexion