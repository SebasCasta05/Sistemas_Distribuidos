import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ============ RUTAS PARA VIVIENDAS ============

// Obtener todas las publicaciones de vivienda
router.get("/viviendas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        pv.*, 
        p.titulo, 
        p.descripcion, 
        p.created_at,
        u.nombre AS autor_nombre,
        u.apellido AS autor_apellido
       FROM publicacionesvivienda pv
       JOIN publicaciones p ON pv.id_publicacion = p.id_publicacion
       JOIN usuario u ON p.id_usuario = u.id_usuario
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
      `SELECT 
        pv.*, 
        p.titulo, 
        p.descripcion, 
        p.created_at,
        u.nombre AS autor_nombre,
        u.apellido AS autor_apellido
       FROM publicacionesvivienda pv
       JOIN publicaciones p ON pv.id_publicacion = p.id_publicacion
       JOIN usuario u ON p.id_usuario = u.id_usuario
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
    
    // 🔹 Luego cambia esto para usar el id_usuario del sessionStorage del frontend
    const id_usuario = 1;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insertar en publicaciones
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


// ============ RUTAS PARA EMPLEOS ============

// Obtener todas las publicaciones de empleo
router.get("/empleos", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        pe.*, 
        p.titulo, 
        p.descripcion, 
        p.created_at,
        u.nombre AS autor_nombre,
        u.apellido AS autor_apellido
       FROM publicacionesempleo pe
       JOIN publicaciones p ON pe.id_publicacion = p.id_publicacion
       JOIN usuario u ON p.id_usuario = u.id_usuario
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
      `SELECT 
        pe.*, 
        p.titulo, 
        p.descripcion, 
        p.created_at,
        u.nombre AS autor_nombre,
        u.apellido AS autor_apellido
       FROM publicacionesempleo pe
       JOIN publicaciones p ON pe.id_publicacion = p.id_publicacion
       JOIN usuario u ON p.id_usuario = u.id_usuario
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
    
    if (!nombre || !salario || !empresa || !modalidad || !telefono || !descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
    
    // 🔹 Luego cambia esto para usar el id_usuario del sessionStorage del frontend
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

export default router;
