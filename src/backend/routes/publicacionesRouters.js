import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ============ RUTAS PARA VIVIENDAS ============

// Obtener todas las publicaciones de vivienda
router.get("/viviendas", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM publicacionesVivienda ORDER BY created_at DESC"
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
      "SELECT * FROM publicacionesVivienda WHERE idpublicacionVivienda = $1",
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
    
    const result = await pool.query(
      `INSERT INTO publicacionesVivienda 
       (nombre, precio, ciudad, ubicacion, telefono, img, descripcion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nombre, precio, ciudad, ubicacion, telefono, img || '', descripcion]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear vivienda:", error);
    res.status(500).json({ error: "Error al crear vivienda" });
  }
});

// Actualizar una publicación de vivienda
router.put("/viviendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, ciudad, ubicacion, telefono, img, descripcion } = req.body;
    
    const result = await pool.query(
      `UPDATE publicacionesVivienda 
       SET nombre = $1, precio = $2, ciudad = $3, ubicacion = $4, 
           telefono = $5, img = $6, descripcion = $7
       WHERE idpublicacionVivienda = $8
       RETURNING *`,
      [nombre, precio, ciudad, ubicacion, telefono, img, descripcion, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vivienda no encontrada" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar vivienda:", error);
    res.status(500).json({ error: "Error al actualizar vivienda" });
  }
});

// Eliminar una publicación de vivienda
router.delete("/viviendas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM publicacionesVivienda WHERE idpublicacionVivienda = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vivienda no encontrada" });
    }
    
    res.json({ message: "Vivienda eliminada exitosamente" });
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
      "SELECT * FROM publicacionesEmpleo ORDER BY created_at DESC"
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
      "SELECT * FROM publicacionesEmpleo WHERE idpublicacionEmpleo = $1",
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
    
    const result = await pool.query(
      `INSERT INTO publicacionesEmpleo 
       (nombre, salario, empresa, modalidad, telefono, habilidades_minimas, estudios, descripcion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [nombre, salario, empresa, modalidad, telefono, habilidades_minimas || '', estudios || '', descripcion]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear empleo:", error);
    res.status(500).json({ error: "Error al crear empleo" });
  }
});

// Actualizar una publicación de empleo
router.put("/empleos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, salario, empresa, modalidad, telefono, habilidades_minimas, estudios, descripcion } = req.body;
    
    const result = await pool.query(
      `UPDATE publicacionesEmpleo 
       SET nombre = $1, salario = $2, empresa = $3, modalidad = $4, 
           telefono = $5, habilidades_minimas = $6, estudios = $7, descripcion = $8
       WHERE idpublicacionEmpleo = $9
       RETURNING *`,
      [nombre, salario, empresa, modalidad, telefono, habilidades_minimas, estudios, descripcion, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empleo no encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar empleo:", error);
    res.status(500).json({ error: "Error al actualizar empleo" });
  }
});

// Eliminar una publicación de empleo
router.delete("/empleos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM publicacionesEmpleo WHERE idpublicacionEmpleo = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empleo no encontrado" });
    }
    
    res.json({ message: "Empleo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar empleo:", error);
    res.status(500).json({ error: "Error al eliminar empleo" });
  }
});

export default router;