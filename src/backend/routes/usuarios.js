import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ Actualizar imagen de perfil..
router.put("/usuarios/:id/imagen", async (req, res) => {
  const { id } = req.params;
  const { imagen_url } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID de usuario no proporcionado" });
  }

  try {
    await pool.query(
      `UPDATE usuarios
       SET imagen_url = $1
       WHERE id_usuario = $2`,
      [imagen_url || null, id]
    );

    res.json({ success: true, message: "Imagen actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar imagen:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;