import express from "express";
import pool from "../config/db.js";
import { verificarToken } from "../authMiddleware.js";

const router = express.Router();

// Obtener todas las publicaciones
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM publicaciones ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// Obtener una publicación por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM publicaciones WHERE id_publicacion = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener publicación:", error);
    res.status(500).json({ error: "Error al obtener publicación" });
  }
});

// Crear una nueva publicación (requiere sesión iniciada)
router.post("/", verificarToken, async (req, res) => {
  try {
    const { tipo_publicacion, titulo, descripcion } = req.body;

    if (!tipo_publicacion || !titulo || !descripcion) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // id_usuario viene del token
    const id_usuario = req.user.id_usuario;

    const result = await pool.query(
      `INSERT INTO publicaciones (id_usuario, tipo_publicacion, titulo, descripcion)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, tipo_publicacion, titulo, descripcion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear publicación:", error);
    res.status(500).json({ error: "Error al crear publicación" });
  }
});

// Actualizar publicación (solo el dueño puede editar)
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_publicacion, titulo, descripcion } = req.body;
    const id_usuario = req.user.id_usuario;

    // Verificar que la publicación sea del usuario autenticado
    const check = await pool.query(
      "SELECT * FROM publicaciones WHERE id_publicacion = $1 AND id_usuario = $2",
      [id, id_usuario]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "No autorizado para editar esta publicación" });
    }

    const result = await pool.query(
      `UPDATE publicaciones
       SET tipo_publicacion = $1, titulo = $2, descripcion = $3
       WHERE id_publicacion = $4
       RETURNING *`,
      [tipo_publicacion, titulo, descripcion, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar publicación:", error);
    res.status(500).json({ error: "Error al actualizar publicación" });
  }
});

// Eliminar publicación (solo el dueño puede eliminar)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    const check = await pool.query(
      "SELECT * FROM publicaciones WHERE id_publicacion = $1 AND id_usuario = $2",
      [id, id_usuario]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "No autorizado para eliminar esta publicación" });
    }

    await pool.query("DELETE FROM publicaciones WHERE id_publicacion = $1", [id]);

    res.json({ message: "Publicación eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ error: "Error al eliminar publicación" });
  }
});

export default router;
