// src/backend/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "tu_secreto_super_seguro"; // ⚠️ ponlo en .env

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No hay token, acceso denegado" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ error: "Token inválido o ausente" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // guarda los datos del usuario (id_usuario)
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
