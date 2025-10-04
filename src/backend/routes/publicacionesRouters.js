import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ============ RUTAS PARA VIVIENDAS ============

// Obtener todas las publicaciones de vivienda
router.get("/viviendas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pv.*, p.titulo, p.descripcion, p.created_at 
       FROM publicacionesvivienda pv
       JOIN publicaciones p ON pv.id_publicacion = p.id_publicacion
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener viviendas:", error);
    res.status(500).json({ error: "Error al obtener viviendas" });
  }
});

// Obtener una publicación de vivienda por ID
router.get("/viviendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pv.*, p.titulo, p.descripcion, p.created_at 
       FROM publicacionesvivienda pv
       JOIN publicaciones p ON pv.id_publicacion = p.id_publicacion
       WHERE pv.id_publicacionvivienda = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vivienda no encontrada" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener vivienda:", error);
    res.status(500).json({ error: "Error al obtener vivienda" });
  }
});

// Crear una nueva publicación de vivienda
router.post("/viviendas", async (req, res) => {
  try {
    const { nombre, precio, ciudad, ubicacion, telefono, img, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !precio || !ciudad || !ubicacion || !telefono || !descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    // TEMPORAL: id_usuario hardcodeado (cambiar cuando tengas autenticación)
    const id_usuario = 1;
    
    // Iniciar transacción
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insertar en la tabla publicaciones
      const publicacionResult = await client.query(
        `INSERT INTO publicaciones (id_usuario, tipo_publicacion, titulo, descripcion) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id_publicacion`,
        [id_usuario, 'vivienda', nombre, descripcion]
      );
      
      const id_publicacion = publicacionResult.rows[0].id_publicacion;
      
      // 2. Insertar en publicacionesvivienda
      const viviendaResult = await client.query(
        `INSERT INTO publicacionesvivienda 
        (id_publicacion, precio, ciudad, ubicacion, telefono, img) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [id_publicacion, precio, ciudad, ubicacion, telefono, img || '']
      );
      
      await client.query('COMMIT');
      
      res.status(201).json(viviendaResult.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al crear vivienda:", error);
    res.status(500).json({ error: "Error al crear vivienda" });
  }
});

// Actualizar una publicación de vivienda
router.put("/viviendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, precio, ciudad, ubicacion, telefono, img, descripcion } = req.body;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener id_publicacion
      const getIdResult = await client.query(
        'SELECT id_publicacion FROM publicacionesvivienda WHERE id_publicacionvivienda = $1',
        [id]
      );
      
      if (getIdResult.rows.length === 0) {
        throw new Error('Vivienda no encontrada');
      }
      
      const id_publicacion = getIdResult.rows[0].id_publicacion;
      
      // Actualizar tabla publicaciones
      await client.query(
        `UPDATE publicaciones 
         SET titulo = $1, descripcion = $2
         WHERE id_publicacion = $3`,
        [titulo, descripcion, id_publicacion]
      );
      
      // Actualizar tabla publicacionesvivienda
      const result = await client.query(
        `UPDATE publicacionesvivienda 
         SET precio = $1, ciudad = $2, ubicacion = $3, 
             telefono = $4, img = $5
         WHERE id_publicacionvivienda = $6
         RETURNING *`,
        [precio, ciudad, ubicacion, telefono, img, id]
      );
      
      await client.query('COMMIT');
      
      res.json(result.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al actualizar vivienda:", error);
    res.status(500).json({ error: "Error al actualizar vivienda" });
  }
});

// Eliminar una publicación de vivienda
router.delete("/viviendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener id_publicacion
      const getIdResult = await client.query(
        'SELECT id_publicacion FROM publicacionesvivienda WHERE id_publicacionvivienda = $1',
        [id]
      );
      
      if (getIdResult.rows.length === 0) {
        throw new Error('Vivienda no encontrada');
      }
      
      const id_publicacion = getIdResult.rows[0].id_publicacion;
      
      // Eliminar de publicaciones (CASCADE eliminará de publicacionesvivienda)
      await client.query(
        'DELETE FROM publicaciones WHERE id_publicacion = $1',
        [id_publicacion]
      );
      
      await client.query('COMMIT');
      
      res.json({ message: "Vivienda eliminada exitosamente" });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al eliminar vivienda:", error);
    res.status(500).json({ error: "Error al eliminar vivienda" });
  }
});

// ============ RUTAS PARA EMPLEOS ============

// Obtener todas las publicaciones de empleo
router.get("/empleos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pe.*, p.titulo, p.descripcion, p.created_at 
       FROM publicacionesempleo pe
       JOIN publicaciones p ON pe.id_publicacion = p.id_publicacion
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleos:", error);
    res.status(500).json({ error: "Error al obtener empleos" });
  }
});

// Obtener una publicación de empleo por ID
router.get("/empleos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pe.*, p.titulo, p.descripcion, p.created_at 
       FROM publicacionesempleo pe
       JOIN publicaciones p ON pe.id_publicacion = p.id_publicacion
       WHERE pe.id_publicacionempleo = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empleo no encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener empleo:", error);
    res.status(500).json({ error: "Error al obtener empleo" });
  }
});

// Crear una nueva publicación de empleo
router.post("/empleos", async (req, res) => {
  try {
    const { nombre, salario, empresa, modalidad, telefono, habilidades_minimas, estudios, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !salario || !empresa || !modalidad || !telefono || !descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    // TEMPORAL: id_usuario hardcodeado
    const id_usuario = 1;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insertar en publicaciones
      const publicacionResult = await client.query(
        `INSERT INTO publicaciones (id_usuario, tipo_publicacion, titulo, descripcion) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id_publicacion`,
        [id_usuario, 'empleo', nombre, descripcion]
      );
      
      const id_publicacion = publicacionResult.rows[0].id_publicacion;
      
      // 2. Insertar en publicacionesempleo
      const empleoResult = await client.query(
        `INSERT INTO publicacionesempleo 
         (id_publicacion, salario, empresa, modalidad, telefono, habilidades_minimas, estudios) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [id_publicacion, salario, empresa, modalidad, telefono, habilidades_minimas || '', estudios || '']
      );
      
      await client.query('COMMIT');
      
      res.status(201).json(empleoResult.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al crear empleo:", error);
    res.status(500).json({ error: "Error al crear empleo" });
  }
});

// Actualizar una publicación de empleo
router.put("/empleos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, salario, empresa, modalidad, telefono, habilidades_minimas, estudios, descripcion } = req.body;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener id_publicacion
      const getIdResult = await client.query(
        'SELECT id_publicacion FROM publicacionesempleo WHERE id_publicacionempleo = $1',
        [id]
      );
      
      if (getIdResult.rows.length === 0) {
        throw new Error('Empleo no encontrado');
      }
      
      const id_publicacion = getIdResult.rows[0].id_publicacion;
      
      // Actualizar tabla publicaciones
      await client.query(
        `UPDATE publicaciones 
         SET titulo = $1, descripcion = $2
         WHERE id_publicacion = $3`,
        [titulo, descripcion, id_publicacion]
      );
      
      // Actualizar tabla publicacionesempleo
      const result = await client.query(
        `UPDATE publicacionesempleo 
         SET salario = $1, empresa = $2, modalidad = $3, 
             telefono = $4, habilidades_minimas = $5, estudios = $6
         WHERE id_publicacionempleo = $7
         RETURNING *`,
        [salario, empresa, modalidad, telefono, habilidades_minimas, estudios, id]
      );
      
      await client.query('COMMIT');
      
      res.json(result.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al actualizar empleo:", error);
    res.status(500).json({ error: "Error al actualizar empleo" });
  }
});

// Eliminar una publicación de empleo
router.delete("/empleos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener id_publicacion
      const getIdResult = await client.query(
        'SELECT id_publicacion FROM publicacionesempleo WHERE id_publicacionempleo = $1',
        [id]
      );
      
      if (getIdResult.rows.length === 0) {
        throw new Error('Empleo no encontrado');
      }
      
      const id_publicacion = getIdResult.rows[0].id_publicacion;
      
      // Eliminar de publicaciones (CASCADE eliminará de publicacionesempleo)
      await client.query(
        'DELETE FROM publicaciones WHERE id_publicacion = $1',
        [id_publicacion]
      );
      
      await client.query('COMMIT');
      
      res.json({ message: "Empleo eliminado exitosamente" });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error("Error al eliminar empleo:", error);
    res.status(500).json({ error: "Error al eliminar empleo" });
  }
});

export default router;