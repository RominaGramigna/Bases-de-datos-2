const express = require('express');
const connection = require('./conexion');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

/***************** Busqueda ********************/
app.get('/api/obtener-producto', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm || searchTerm == '') {
      const selectAll = 'SELECT * FROM productos';
      connection.query(selectAll, (error, results) => {
      if (error) {
        console.error('Error al obtener datos de los productos:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.status(200).json(results);
    });
  } else {
    const query = `SELECT * FROM productos WHERE articulo LIKE ?`;
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
  }
  });

  app.get('/api/completar-producto/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = `SELECT * FROM productos WHERE id_articulo = ?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err)
        };
        res.json(result[0]);
    });
  });
  /***************** INSERCION Y MODIFICACION ********************/
  app.post('/api/guardar-producto', (req, res) => {
    const { ID_Articulo, Articulo, Categoria, Precio, Cantidad} = req.body;
  
    // Verificar si el ID ya existe
    const checkQuery = 'SELECT COUNT(*) AS count FROM productos WHERE id_articulo = ?';
    connection.query(checkQuery, [ID_Articulo], (error, results) => {
        if (error) {
            console.error('Error al verificar la existencia del producto:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
  
        const exists = results[0].count > 0;
  
        if (exists) {
            // Si existe, realiza un UPDATE
            const updateQuery = 'UPDATE productos SET articulo = ?, categoria = ?, precio = ?, cantidad = ? WHERE id_articulo = ?';
            const updateValues = [Articulo, Categoria, Precio, Cantidad, ID_Articulo];
  
            connection.query(updateQuery, updateValues, (updateError, updateResults) => {
                if (updateError) {
                    console.error('Error al actualizar datos en la base de datos:', updateError);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }
                res.status(200).json({ message: 'Producto actualizado correctamente' });
            });
        } else {
            // Si no existe, realiza un INSERT
            const insertQuery = 'INSERT INTO Productos (ID_Articulo, Articulo, Categoria, Precio, Cantidad) VALUES (?, ?, ?, ?, ?)';
            const insertValues = [ID_Articulo, Articulo, Categoria, Precio, Cantidad];
  
            connection.query(insertQuery, insertValues, (insertError, insertResults) => {
                if (insertError) {
                    console.error('Error al insertar datos en la base de datos:', insertError);
                    return res.status(500).json({ error: 'Error en el servidor' });
                }
                res.status(201).json({ message: 'Producto insertado correctamente', id: insertResults.insertId });
            });
        }
    });
  });
  
  /*************************** BORRADO ************************************/
   app.delete('/api/eliminar-producto/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM productos WHERE ID_Articulo = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el registro:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    });
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });