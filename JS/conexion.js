const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Guarde_2024',
  database: 'kiosco'
});

connection.connect((error) => {
  if(error){
    console.log('Error al conectar con la base de datos.');
    return;
  }
  console.log('Conexión establecida con éxito.');
});

module.exports = connection;