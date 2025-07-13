import { pool } from './database.js';

const CAMPOS_VALIDOS = ['titulo', 'autor', 'año', 'editorial', 'isbn'];

class LibroController {
  async getAll(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM libros');
      res.json(rows);
    } catch (error) {
      console.error('❌ Error en getAll:', error);
      res.status(500).json({ error: 'Error al obtener libros' });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error('❌ Error en getOne:', error);
      res.status(500).json({ error: 'Error al obtener libro' });
    }
  }

  async add(req, res) {
    try {
      const libro = req.body;

      const camposExtra = Object.keys(libro).filter(k => !CAMPOS_VALIDOS.includes(k));
      if (camposExtra.length > 0) {
        return res.status(400).json({
          error: 'Campos no permitidos en el cuerpo de la solicitud',
          camposExtra
        });
      }

      const result = await pool.query(
        `INSERT INTO libros (titulo, autor, año, editorial, isbn)
         VALUES (?, ?, ?, ?, ?)`,
        [libro.titulo, libro.autor, libro.año, libro.editorial, libro.isbn]
      );

      res.json({ idInsertado: result[0].insertId });
    } catch (error) {
      console.error('❌ Error en add:', error);
      res.status(500).json({ error: 'Error al insertar libro' });
    }
  }

  async update(req, res) {
    try {
      const libro = req.body;

      const camposExtra = Object.keys(libro).filter(k => !CAMPOS_VALIDOS.includes(k));
      if (camposExtra.length > 0) {
        return res.status(400).json({
          error: 'Campos no permitidos en el cuerpo de la solicitud',
          camposExtra
        });
      }

      const result = await pool.query(
        `UPDATE libros
         SET titulo = ?, autor = ?, año = ?, editorial = ?
         WHERE isbn = ?`,
        [libro.titulo, libro.autor, libro.año, libro.editorial, libro.isbn]
      );

      res.json({ librosActualizados: result[0].affectedRows });
    } catch (error) {
      console.error('❌ Error en update:', error);
      res.status(500).json({ error: 'Error al actualizar libro' });
    }
  }

  async delete(req, res) {
    try {
      const { isbn } = req.params;

      const result = await pool.query('DELETE FROM libros WHERE isbn = ?', [isbn]);

      res.json({ librosEliminados: result[0].affectedRows });
    } catch (error) {
      console.error('❌ Error en delete:', error);
      res.status(500).json({ error: 'Error al eliminar libro' });
    }
  }
}

export const libro = new LibroController();
// Log para debug de eliminación por ISBN
